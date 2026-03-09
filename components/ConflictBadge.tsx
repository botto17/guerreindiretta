type Props = {
  name: string
  color: string
  intensity?: 'alta' | 'media' | 'tensione'
  size?: 'sm' | 'md'
}

export default function ConflictBadge({ name, color, size = 'sm' }: Props) {
  const padding = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-xs'
  return (
    <span
      className={`inline-block ${padding} font-sans font-semibold uppercase tracking-wide text-white rounded-sm`}
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  )
}
