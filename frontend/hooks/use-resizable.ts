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
  scale?: number // 추가: 스케일링 팩터
  containerRef?: React.RefObject<HTMLElement> // 추가: 컨테이너 참조
  elementRef?: React.RefObject<HTMLElement> // 추가: 요소 참조
}

export function useResizable({
  initialSize = { width: 100, height: 100 },
  aspectRatio,
  minWidth = 20,
  minHeight = 20,
  onResizeEnd,
  scale = 1, // 기본값 1
  containerRef,
  elementRef,
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

      // 스케일을 고려한 델타 계산
      const deltaX = (clientX - resizeStartRef.current.x) / scale
      const deltaY = (clientY - resizeStartRef.current.y) / scale

      // 새 크기 계산
      let newWidth = Math.max(resizeStartRef.current.width + deltaX, minWidth)
      let newHeight = Math.max(resizeStartRef.current.height + deltaY, minHeight)

      // 종횡비 유지
      if (aspectRatio) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / aspectRatio
        } else {
          newWidth = newHeight * aspectRatio
        }
      }

      // 카드 경계 체크 (요소가 카드 밖으로 나가지 않도록)
      if (elementRef?.current && containerRef?.current) {
        const elementRect = elementRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        // 요소의 현재 위치
        const elementX = elementRect.left - containerRect.left
        const elementY = elementRect.top - containerRect.top

        // 카드 크기 (기본값 400x300)
        const cardWidth = 400
        const cardHeight = 300

        // 요소의 위치 (스케일 고려)
        const posX = elementX / scale
        const posY = elementY / scale

        // 경계 체크 및 조정 - 더 엄격하게 제한
        const maxWidth = cardWidth - posX
        const maxHeight = cardHeight - posY

        newWidth = Math.min(newWidth, maxWidth)
        newHeight = Math.min(newHeight, maxHeight)

        // 종횡비 유지하면서 경계 체크
        if (aspectRatio) {
          if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio
          } else {
            newHeight = newWidth / aspectRatio
          }

          // 다시 한번 최대 크기 체크
          newWidth = Math.min(newWidth, maxWidth)
          newHeight = Math.min(newHeight, maxHeight)
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
  }, [isResizing, aspectRatio, minWidth, minHeight, onResizeEnd, scale, containerRef, elementRef])

  return {
    size,
    isResizing,
    handleResizeStart,
    setSize,
  }
}

