import React from 'react'

export default function Subtitle({text, className}: {text: string; className?: string}) {
  return (
    <span className={`max-2xl:text-[13px] text-quaternary uppercase 2xl:tracking-[4px] tracking-[2px] ${className}`}>{text}</span>
  )
}
