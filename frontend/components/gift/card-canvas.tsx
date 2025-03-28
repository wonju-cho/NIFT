"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import type { CardElement as CardElementType } from "@/types/gift-card"
import { cn } from "@/lib/utils"

interface CardCanvasProps {
  elements: CardElementType[]
  background: string
  isFlipped: boolean
  onSelectElement: (id: string | null) => void
  onUpdateElement: (element: CardElementType) => void
  selectedElementId: string | null
  onDeleteElement: (id: string) => void
}

export function CardCanvas({
  elements,
  background,
  isFlipped,
  onSelectElement,
  onUpdateElement,
  selectedElementId,
  onDeleteElement,
}: CardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }) // 기본 캔버스 크기
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 })
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 })
  const [isRotating, setIsRotating] = useState(false)
  const [rotateStartAngle, setRotateStartAngle] = useState(0)

  // 캔버스 크기 조정 및 요소 다시 그리기
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current && canvasRef.current) {
        const containerWidth = containerRef.current.clientWidth
        const containerHeight = containerRef.current.clientHeight

        // 캔버스 크기 설정 (4:3 비율 유지)
        const newWidth = containerWidth
        const newHeight = containerWidth * 0.75 // 4:3 비율

        setCanvasSize({ width: newWidth, height: newHeight })

        // 캔버스 요소의 실제 크기 설정
        canvasRef.current.width = newWidth
        canvasRef.current.height = newHeight

        // 스케일 계산 (기준 크기 800x600 대비)
        const newScale = newWidth / 800
        setScale(newScale)
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  // 캔버스에 요소 그리기
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
  
    const ctx = canvas.getContext("2d")
    if (!ctx) return
  
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  
    if (background.startsWith("linear-gradient") || background.startsWith("radial-gradient")) {
      ctx.fillStyle = "#f8f9fa"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (background.startsWith("#") || background.startsWith("rgb")) {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (background.startsWith("url(") || background.startsWith("data:")) {
      const imgUrl = background.slice(4, -1).replace(/['"]/g, "")
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
  
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        drawElements(ctx)
      }
      img.src = imgUrl
      return
    }
  
    drawElements(ctx)
  
    function drawElements(ctx: CanvasRenderingContext2D) {
      const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex)
  
      for (const element of sortedElements) {
        const x = element.x * scale
        const y = element.y * scale
        const width = element.width * scale
        const height = element.height * scale
  
        ctx.save()
        ctx.translate(x + width / 2, y + height / 2)
        ctx.rotate((element.rotation * Math.PI) / 180)
  
        if ((element.type === "image" || element.type === "sticker") && element.src) {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
            const canvas = canvasRef.current
            if (!canvas) return
            const ctx = canvas.getContext("2d")
            if (!ctx) return
  
            ctx.save()
            ctx.translate(x + width / 2, y + height / 2)
            ctx.rotate((element.rotation * Math.PI) / 180)
            ctx.drawImage(img, -width / 2, -height / 2, width, height)
  
            if (element.id === selectedElementId) {
              drawSelectionBorder(ctx, -width / 2, -height / 2, width, height)
              drawResizeHandle(ctx, width / 2, height / 2)
              drawRotateHandle(ctx, 0, -height / 2 - 30)
              drawDeleteHandle(ctx, -width / 2, -height / 2)
            }
  
            ctx.restore()
          }
          img.src = element.src
        } else if (element.type === "text") {
          ctx.fillStyle = "#000000"
          ctx.font = `${Math.min(width / 10, height / 2)}px ${element.fontFamily || "Arial"}`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
  
          const text = element.content || ""
          const words = text.split(" ")
          let line = ""
          const lines = []
          const lineHeight = Math.min(width / 10, height / 2) * 1.2
  
          for (const word of words) {
            const testLine = line + word + " "
            const metrics = ctx.measureText(testLine)
            if (metrics.width > width - 20) {
              lines.push(line)
              line = word + " "
            } else {
              line = testLine
            }
          }
          lines.push(line)
  
          let yOffset = -height / 2 + lineHeight
          for (const line of lines) {
            ctx.fillText(line, 0, yOffset)
            yOffset += lineHeight
          }
  
          if (element.id === selectedElementId) {
            drawSelectionBorder(ctx, -width / 2, -height / 2, width, height)
            drawResizeHandle(ctx, width / 2, height / 2)
            drawRotateHandle(ctx, 0, -height / 2 - 30)
            drawDeleteHandle(ctx, -width / 2, -height / 2)
          }
        }
  
        ctx.restore()
      }
    }
  
    function drawSelectionBorder(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)
    }
  
    function drawResizeHandle(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }
  
    function drawRotateHandle(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
  
      ctx.strokeStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 1.5)
      ctx.stroke()
    }
  
    function drawDeleteHandle(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ctx.fillStyle = "#ffffff"
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
  
      ctx.strokeStyle = "#ef4444"
      ctx.beginPath()
      ctx.moveTo(x - 3, y - 3)
      ctx.lineTo(x + 3, y + 3)
      ctx.moveTo(x + 3, y - 3)
      ctx.lineTo(x - 3, y + 3)
      ctx.stroke()
    }
  }, [elements, background, selectedElementId, scale])

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // 요소 찾기 (zIndex 역순으로 검사하여 상위 요소 먼저 선택)
    const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex)

    for (const element of sortedElements) {
      const elementX = element.x * scale
      const elementY = element.y * scale
      const elementWidth = element.width * scale
      const elementHeight = element.height * scale

      // 요소의 중심점과 회전 각도 계산
      const centerX = elementX + elementWidth / 2
      const centerY = elementY + elementHeight / 2
      const angle = (element.rotation * Math.PI) / 180

      // 마우스 좌표를 회전된 요소의 좌표계로 변환
      const rotatedX = Math.cos(angle) * (x - centerX) - Math.sin(angle) * (y - centerY) + centerX
      const rotatedY = Math.sin(angle) * (x - centerX) + Math.cos(angle) * (y - centerY) + centerY

      // 변환된 좌표가 요소 내부에 있는지 확인
      if (
        rotatedX >= elementX &&
        rotatedX <= elementX + elementWidth &&
        rotatedY >= elementY &&
        rotatedY <= elementY + elementHeight
      ) {
        // 선택된 요소가 있고, 리사이즈 핸들을 클릭한 경우
        if (element.id === selectedElementId) {
          const resizeHandleX = elementX + elementWidth
          const resizeHandleY = elementY + elementHeight

          if (Math.sqrt(Math.pow(x - resizeHandleX, 2) + Math.pow(y - resizeHandleY, 2)) <= 8) {
            // 리사이즈 시작
            setIsResizing(true)
            setResizeStartPos({ x, y })
            setResizeStartSize({ width: element.width, height: element.height })
            return
          }

          // 회전 핸들을 클릭한 경우
          const rotateHandleX = centerX
          const rotateHandleY = elementY - 30 * scale

          if (Math.sqrt(Math.pow(x - rotateHandleX, 2) + Math.pow(y - rotateHandleY, 2)) <= 10) {
            // 회전 시작
            setIsRotating(true)
            setRotateStartAngle(Math.atan2(y - centerY, x - centerX))
            return
          }

          // 삭제 핸들을 클릭한 경우
          const deleteHandleX = elementX
          const deleteHandleY = elementY

          if (Math.sqrt(Math.pow(x - deleteHandleX, 2) + Math.pow(y - deleteHandleY, 2)) <= 8) {
            // 요소 삭제
            onDeleteElement(element.id)
            return
          }
        }

        // 요소 드래그 시작
        setIsDragging(true)
        setDragStartPos({ x, y })
        setDraggedElementId(element.id)
        onSelectElement(element.id)
        return
      }
    }

    // 빈 영역 클릭 시 선택 해제
    onSelectElement(null)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isDragging && draggedElementId) {
      const element = elements.find((el) => el.id === draggedElementId)
      if (!element) return

      const deltaX = (x - dragStartPos.x) / scale
      const deltaY = (y - dragStartPos.y) / scale

      onUpdateElement({
        ...element,
        x: element.x + deltaX,
        y: element.y + deltaY,
      })

      setDragStartPos({ x, y })
    } else if (isResizing && selectedElementId) {
      const element = elements.find((el) => el.id === selectedElementId)
      if (!element) return

      const deltaX = (x - resizeStartPos.x) / scale
      const deltaY = (y - resizeStartPos.y) / scale

      const newWidth = Math.max(20, resizeStartSize.width + deltaX)
      const newHeight = Math.max(20, resizeStartSize.height + deltaY)

      onUpdateElement({
        ...element,
        width: newWidth,
        height: newHeight,
      })
    } else if (isRotating && selectedElementId) {
      const element = elements.find((el) => el.id === selectedElementId)
      if (!element) return

      const elementX = element.x * scale
      const elementY = element.y * scale
      const elementWidth = element.width * scale
      const elementHeight = element.height * scale

      const centerX = elementX + elementWidth / 2
      const centerY = elementY + elementHeight / 2

      const angle = Math.atan2(y - centerY, x - centerX)
      const angleDiff = angle - rotateStartAngle
      const newRotation = (element.rotation + (angleDiff * 180) / Math.PI) % 360

      onUpdateElement({
        ...element,
        rotation: newRotation,
      })

      setRotateStartAngle(angle)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
    setIsRotating(false)
  }

  return (
    <div ref={containerRef} className="w-full aspect-[4/3] relative rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className={cn("absolute inset-0", isFlipped ? "rotate-y-180" : "")}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  )
}

