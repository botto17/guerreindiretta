'use client'

import { marked } from 'marked'
import { useMemo } from 'react'

type Props = {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: Props) {
  const html = useMemo(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
    return marked.parse(content) as string
  }, [content])

  return (
    <div
      className={`prose-article ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
