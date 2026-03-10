'use client'

import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo'
import { feature } from 'topojson-client'
import type { FeatureCollection, Geometry } from 'geojson'
import { Conflict } from '@/lib/supabase'

/* Minimal TopoJSON types so we don't need @types/topojson-specification */
interface TopoGeometryCollection {
  type: 'GeometryCollection'
  geometries: Array<{ type: string; arcs: number[][]; properties?: Record<string, unknown>; id?: string | number }>
}
interface Topology {
  type: 'Topology'
  objects: Record<string, TopoGeometryCollection>
  arcs: number[][][]
  [key: string]: unknown
}

type Props = {
  conflicts: Conflict[]
}

const WIDTH = 960
const HEIGHT = 500

const intensityLabels: Record<string, string> = {
  alta: 'Alta Intensità',
  media: 'Media Intensità',
  tensione: 'Tensione',
}

export default function WorldMap({ conflicts }: Props) {
  const [worldData, setWorldData] = useState<FeatureCollection<Geometry> | null>(null)
  const [hovered, setHovered] = useState<{
    conflict: Conflict
    x: number
    y: number
  } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/world-110m.json')
      .then((res) => res.json())
      .then((topology: Topology) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const countries = feature(topology as any, topology.objects.countries as any) as unknown as FeatureCollection<Geometry>
        setWorldData(countries)
      })
      .catch((err) => console.error('Failed to load world map:', err))
  }, [])

  const projection = useMemo(
    () =>
      geoNaturalEarth1()
        .scale(160)
        .translate([WIDTH / 2, HEIGHT / 2]),
    []
  )

  const pathGenerator = useMemo(() => geoPath(projection), [projection])
  const graticule = useMemo(() => geoGraticule().step([20, 20])(), [])

  // Project conflict coordinates
  const projectedConflicts = useMemo(() => {
    return conflicts.map((conflict) => {
      const coords = projection([conflict.longitude, conflict.latitude])
      return { conflict, x: coords?.[0] ?? 0, y: coords?.[1] ?? 0 }
    })
  }, [conflicts, projection])

  // Convert SVG coords to screen coords for tooltip positioning
  const getScreenCoords = useCallback((svgX: number, svgY: number) => {
    if (!svgRef.current || !containerRef.current) return { left: 0, top: 0 }
    const svg = svgRef.current
    const container = containerRef.current
    const containerRect = container.getBoundingClientRect()
    const svgRect = svg.getBoundingClientRect()
    // Scale factor from viewBox to rendered size
    const scaleX = svgRect.width / WIDTH
    const scaleY = svgRect.height / HEIGHT
    return {
      left: svgRect.left - containerRect.left + svgX * scaleX,
      top: svgRect.top - containerRect.top + svgY * scaleY,
    }
  }, [])

  return (
    <div className="w-full overflow-hidden relative" id="mappa" ref={containerRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: '50vh', background: '#eef0f2' }}
      >
        {/* Ocean background */}
        <rect width={WIDTH} height={HEIGHT} fill="#eef0f2" />

        {/* Globe outline (sphere) */}
        <path
          d={pathGenerator({ type: 'Sphere' }) || ''}
          fill="none"
          stroke="#d4d8dc"
          strokeWidth="0.5"
        />

        {/* Graticule (grid lines) */}
        <path
          d={pathGenerator(graticule) || ''}
          fill="none"
          stroke="#dde0e4"
          strokeWidth="0.25"
        />

        {/* Countries */}
        {worldData?.features.map((feat, i) => (
          <path
            key={feat.id ?? i}
            d={pathGenerator(feat) || ''}
            fill="#cdd1d6"
            stroke="#b8bdc4"
            strokeWidth="0.4"
          />
        ))}

        {/* Conflict dots */}
        {projectedConflicts.map(({ conflict, x, y }) => (
          <Link
            key={conflict.id}
            href={`/conflitti/${conflict.slug}`}
            aria-label={conflict.name}
          >
            <g
              className="cursor-pointer"
              onMouseEnter={() => setHovered({ conflict, x, y })}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulse ring */}
              <circle cx={x} cy={y} r="6" fill={conflict.color} opacity="0.3">
                <animate
                  attributeName="r"
                  from="6"
                  to="20"
                  dur="2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Core dot */}
              <circle
                cx={x}
                cy={y}
                r={hovered?.conflict.id === conflict.id ? 7 : 5}
                fill={conflict.color}
                style={{ transition: 'r 0.2s ease' }}
              />
            </g>
          </Link>
        ))}
      </svg>

      {/* Custom tooltip */}
      {hovered && (() => {
        const pos = getScreenCoords(hovered.x, hovered.y)
        return (
          <div
            className="absolute z-50 pointer-events-none"
            style={{
              left: pos.left,
              top: pos.top,
              transform: 'translate(-50%, -100%) translateY(-14px)',
            }}
          >
            <div
              className="px-3 py-2 rounded shadow-lg text-center whitespace-nowrap"
              style={{
                background: 'rgba(17, 17, 17, 0.92)',
                backdropFilter: 'blur(4px)',
              }}
            >
              <p className="text-white text-xs font-semibold font-sans leading-tight">
                {hovered.conflict.name}
              </p>
              <p className="text-gray-300 text-[10px] font-sans mt-0.5">
                {intensityLabels[hovered.conflict.intensity] ?? hovered.conflict.intensity}
                {hovered.conflict.region && ` · ${hovered.conflict.region}`}
              </p>
            </div>
            {/* Arrow */}
            <div
              className="mx-auto w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid rgba(17, 17, 17, 0.92)',
                width: 0,
                margin: '0 auto',
              }}
            />
          </div>
        )
      })()}
    </div>
  )
}
