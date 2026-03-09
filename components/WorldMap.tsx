import Link from 'next/link'
import { latLonToSvg } from '@/lib/geo'
import { Conflict } from '@/lib/supabase'

type Props = {
  conflicts: Conflict[]
}

export default function WorldMap({ conflicts }: Props) {
  return (
    <div className="w-full bg-navy rounded-sm overflow-hidden" id="mappa">
      <svg
        viewBox="0 0 1000 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ maxHeight: '50vh' }}
      >
        {/* Ocean background */}
        <rect width="1000" height="500" fill="#1a1a2e" />

        {/* Simplified world continents as paths */}
        {/* North America */}
        <path
          d="M 80 60 L 180 50 L 250 80 L 270 120 L 230 160 L 200 200 L 170 240 L 130 260 L 90 220 L 70 180 L 60 130 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Central America */}
        <path d="M 170 240 L 200 260 L 185 280 L 165 270 Z" fill="#2d3561" stroke="#3a4080" strokeWidth="0.5" />
        {/* South America */}
        <path
          d="M 185 280 L 220 270 L 260 290 L 280 340 L 270 400 L 240 440 L 210 450 L 195 420 L 180 380 L 175 330 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Europe */}
        <path
          d="M 440 60 L 500 55 L 530 80 L 520 110 L 490 120 L 460 115 L 440 100 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Scandinavia */}
        <path d="M 470 30 L 510 25 L 520 55 L 490 60 L 460 55 Z" fill="#2d3561" stroke="#3a4080" strokeWidth="0.5" />
        {/* Africa */}
        <path
          d="M 450 140 L 510 130 L 560 150 L 580 200 L 575 270 L 550 340 L 510 380 L 480 370 L 455 320 L 440 260 L 435 200 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Middle East */}
        <path
          d="M 530 110 L 590 105 L 620 130 L 600 160 L 560 165 L 535 145 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Russia / Central Asia */}
        <path
          d="M 520 30 L 700 20 L 780 50 L 750 100 L 680 110 L 620 100 L 560 95 L 530 80 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* South Asia */}
        <path
          d="M 620 130 L 680 120 L 720 140 L 710 190 L 670 210 L 640 200 L 620 170 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* East Asia */}
        <path
          d="M 720 60 L 800 55 L 840 80 L 830 130 L 790 150 L 750 140 L 720 120 L 710 90 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Southeast Asia */}
        <path
          d="M 750 150 L 800 145 L 820 170 L 800 200 L 770 195 L 750 175 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />
        {/* Australia */}
        <path
          d="M 770 280 L 850 270 L 890 300 L 880 360 L 840 380 L 790 370 L 765 330 Z"
          fill="#2d3561"
          stroke="#3a4080"
          strokeWidth="0.5"
        />

        {/* Conflict dots */}
        {conflicts.map((conflict) => {
          const { x, y } = latLonToSvg(conflict.latitude, conflict.longitude)
          return (
            <Link
              key={conflict.id}
              href={`/conflitti/${conflict.slug}`}
              aria-label={conflict.name}
            >
              <g className="cursor-pointer">
                <title>{conflict.name} — {conflict.intensity}</title>
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
                  r="5"
                  fill={conflict.color}
                  className="hover:r-7 transition-all"
                />
              </g>
            </Link>
          )
        })}
      </svg>
    </div>
  )
}
