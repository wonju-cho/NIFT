"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface UseRotatableProps {
  initialRotation?: number
  onRotateEnd?: (rotation: number) => void
}

export function useRotatable({ initialRotation = 0, onRotateEnd }: UseRotatableProps = {}) {
  const [rotation, setRotation] = useState<number>(initialRotation)
  const [isRotating, setIsRotating] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef<number>(initialRotation)
  const centerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const startAngleRef = useRef<number>(0)

  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  const handleRotateStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsRotating(true)

    if (!elementRef.current) return

    const rect = elementRef.current.getBoundingClientRect()
    centerRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    startAngleRef.current = Math.atan2(clientY - centerRef.current.y, clientX - centerRef.current.x) * (180 / Math.PI)
  }

  useEffect(() => {
    const handleRotateMove = (e: MouseEvent | TouchEvent) => {
      if (!isRotating) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      const angle = Math.atan2(clientY - centerRef.current.y, clientX - centerRef.current.x) * (180 / Math.PI)
      const deltaAngle = angle - startAngleRef.current

      // 회전 각도 업데이트
      const newRotation = rotationRef.current + deltaAngle
      setRotation(newRotation)
      rotationRef.current = newRotation
      startAngleRef.current = angle
    }

    const handleRotateEnd = () => {
      if (isRotating) {
        setIsRotating(false)
        onRotateEnd?.(rotationRef.current)
      }
    }

    if (isRotating) {
      document.addEventListener("mousemove", handleRotateMove, { passive: false })
      document.addEventListener("touchmove", handleRotateMove, { passive: false })
      document.addEventListener("mouseup", handleRotateEnd)
      document.addEventListener("touchend", handleRotateEnd)
    }

    return () => {
      document.removeEventListener("mousemove", handleRotateMove)
      document.removeEventListener("touchmove", handleRotateMove)
      document.removeEventListener("mouseup", handleRotateEnd)
      document.removeEventListener("touchend", handleRotateEnd)
    }
  }, [isRotating, onRotateEnd])

  return {
    rotation,
    isRotating,
    elementRef,
    handleRotateStart,
    setRotation,
  }
}

