import React, { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  durationMs?: number
  formatter?: (val: number) => string
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  durationMs = 800,
  formatter = (v) => v.toLocaleString(),
}) => {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValueRef = useRef(value)

  useEffect(() => {
    let startTimestamp: number | null = null
    const startValue = prevValueRef.current
    prevValueRef.current = value

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1)
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (value - startValue) * easeProgress)
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    const frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [value, durationMs])

  return <span>{formatter(displayValue)}</span>
}
