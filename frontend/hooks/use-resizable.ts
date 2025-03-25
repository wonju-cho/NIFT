"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface Size {
  width: number
  height: number
}

interface UseResizableProps {
  initialSize?: Size
  aspectRatio?: number
  minWidth?: number
  minHeight?: number
  onResizeEnd?: (size: Size) => void
}

export function useResizable({
  initialSize = { width: 100, height: 100 },
  aspectRatio,
  minWidth = 20,
  minHeight = 20,
  onResizeEnd,
}: UseResizableProps = {}) {
  const [size, setSize] = useState<Size>(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: initialSize.width,
    height: initialSize.height,
  })
  const sizeRef = useRef<Size>(initialSize)

  useEffect(() => {
    sizeRef.current = size
  }, [size])

  const handleResizeStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    corner: string,
  ) => {
    e.stopPropagation()
    setIsResizing(true)

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: sizeRef.current.width,
      height: sizeRef.current.height,
    }
  }

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      if (!isResizing) return

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY

      const deltaX = clientX - resizeStartRef.current.x
      const deltaY = clientY - resizeStartRef.current.y

      let newWidth = Math.max(resizeStartRef.current.width + deltaX, minWidth)
      let newHeight = Math.max(resizeStartRef.current.height + deltaY, minHeight)

      if (aspectRatio) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio
        } else {
          newWidth = newHeight * aspectRatio
        }
      }

      setSize({ width: newWidth, height: newHeight })
    }

    const handleResizeEnd = () => {
      if (isResizing) {
        setIsResizing(false)
        onResizeEnd?.(sizeRef.current)
      }
    }

    document.addEventListener("mousemove", handleResizeMove)
    document.addEventListener("mouseup", handleResizeEnd)
    document.addEventListener("touchmove", handleResizeMove)
    document.addEventListener("touchend", handleResizeEnd)

    return () => {
      document.removeEventListener("mousemove", handleResizeMove)
      document.removeEventListener("mouseup", handleResizeEnd)
      document.removeEventListener("touchmove", handleResizeMove)
      document.removeEventListener("touchend", handleResizeEnd)
    }
  }, [isResizing, aspectRatio, minWidth, minHeight, onResizeEnd])

  return {
    size,
    isResizing,
    handleResizeStart,
    setSize,
  }
}

