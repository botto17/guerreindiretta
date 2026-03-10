type Props = {
  name: string
  color: string
  intensity?: 'alta' | 'media' | 'tensione'
  size?: 'sm' | 'md'
}

export default function ConflictBadge({ name, color, size = 'sm' }: Props) {
  const textSize = size === 'md' ? 'text-xs' : 'text-[11px]'
  return (
    <span
      className={`inline-block ${textSize} font-sans font-semibold uppercase tracking-wide`}
      style={{ color }}
    >
      {name}
    </span>
  )
}
