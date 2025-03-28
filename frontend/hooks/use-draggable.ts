"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"

interface Position {
  x: number
  y: number
}

interface UseDraggableProps {
  initialPosition?: Position
  onDragEnd?: (position: Position) => void
  containerRef?: React.RefObject<HTMLElement>
  isCardFlipped?: boolean
  scale?: number
}

export function useDraggable({
  initialPosition = { x: 0, y: 0 },
  onDragEnd,
  containerRef,
  isCardFlipped = false,
  scale = 1,
}: UseDraggableProps = {}) {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<Position>({ x: 0, y: 0 })
  const positionRef = useRef<Position>(initialPosition)

  useEffect(() => {
    positionRef.current = position
  }, [position])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 텍스트 편집 중에는 드래그 방지
    if (
      (e.target as HTMLElement).tagName === "INPUT" ||
      (e.target as HTMLElement).tagName === "TEXTAREA" ||
      (e.target as HTMLElement).tagName === "BUTTON" ||
      (e.target as HTMLElement).closest(".border.rounded-md.p-3.mt-4") // 편집 UI 영역 내부 클릭 시 드래그 방지
    ) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)
    dragStartRef.current = { x: e.clientX, y: e.clientY }
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // 텍스트 편집 중에는 드래그 방지
    if (
      (e.target as HTMLElement).tagName === "INPUT" ||
      (e.target as HTMLElement).tagName === "TEXTAREA" ||
      (e.target as HTMLElement).tagName === "BUTTON" ||
      (e.target as HTMLElement).closest(".border.rounded-md.p-3.mt-4") // 편집 UI 영역 내부 클릭 시 드래그 방지
    ) {
      return
    }

    e.stopPropagation()
    setIsDragging(true)
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  // 드래그 이벤트 핸들러 최적화
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      // 스케일을 고려한 위치 계산
      const scaledDeltaX = deltaX / scale
      const scaledDeltaY = deltaY / scale

      // 새 위치 계산
      let newX = positionRef.current.x + scaledDeltaX
      let newY = positionRef.current.y + scaledDeltaY

      // 카드 경계 체크 (요소가 카드 밖으로 나가지 않도록)
      if (elementRef.current && containerRef?.current) {
        const elementRect = elementRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        const elementWidth = elementRect.width / scale
        const elementHeight = elementRect.height / scale

        // 카드 크기 (기본값 400x300)
        const cardWidth = 400
        const cardHeight = 300

        // 경계 체크 및 조정 - 더 엄격하게 제한
        newX = Math.max(0, newX)
        newY = Math.max(0, newY)
        newX = Math.min(cardWidth - elementWidth, newX)
        newY = Math.min(cardHeight - elementHeight, newY)
      }

      setPosition({ x: newX, y: newY })
      dragStartRef.current = { x: e.clientX, y: e.clientY }
    },
    [isDragging, scale, containerRef],
  )

  // 터치 이벤트 핸들러 최적화
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return

      const deltaX = e.touches[0].clientX - dragStartRef.current.x
      const deltaY = e.touches[0].clientY - dragStartRef.current.y

      // 스케일을 고려한 위치 계산
      const scaledDeltaX = deltaX / scale
      const scaledDeltaY = deltaY / scale

      // 새 위치 계산
      let newX = positionRef.current.x + scaledDeltaX
      let newY = positionRef.current.y + scaledDeltaY

      // 카드 경계 체크 (요소가 카드 밖으로 나가지 않도록)
      if (elementRef.current && containerRef?.current) {
        const elementRect = elementRef.current.getBoundingClientRect()
        const containerRect = containerRef.current.getBoundingClientRect()

        const elementWidth = elementRect.width / scale
        const elementHeight = elementRect.height / scale

        // 카드 크기 (기본값 400x300)
        const cardWidth = 400
        const cardHeight = 300

        // 경계 체크 및 조정 - 더 엄격하게 제한
        newX = Math.max(0, newX)
        newY = Math.max(0, newY)
        newX = Math.min(cardWidth - elementWidth, newX)
        newY = Math.min(cardHeight - elementHeight, newY)
      }

      setPosition({ x: newX, y: newY })
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    },
    [isDragging, scale, containerRef],
  )

  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        onDragEnd?.(positionRef.current)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging, onDragEnd, isCardFlipped, scale, handleMouseMove, handleTouchMove])

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
    handleTouchStart,
    setPosition,
  }
}

