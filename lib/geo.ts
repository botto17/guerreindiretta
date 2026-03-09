const SVG_WIDTH = 1000
const SVG_HEIGHT = 500

export function latLonToSvg(lat: number, lon: number): { x: number; y: number } {
  const x = (lon + 180) * (SVG_WIDTH / 360)
  const y = (90 - lat) * (SVG_HEIGHT / 180)
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
}
