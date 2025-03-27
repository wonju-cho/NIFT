"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import type { CardElement as CardElementType } from "@/types/gift-card"
import { cardTemplates } from "@/data/card-templates"
import { stickers } from "@/data/stickers"
import { CardElement } from "@/components/gift/card-element"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Repeat, Mail, User } from "lucide-react"
import { ImageHandler } from "./image-handler"

// 사용 가능한 글꼴 목록 정의
const fontOptions = [
  { name: "기본", value: "inherit" },
  { name: "명조체", value: "'Noto Serif KR', serif" },
  { name: "고딕체", value: "'Noto Sans KR', sans-serif" },
  { name: "손글씨", value: "'Gaegu', cursive" },
  { name: "둥근체", value: "'Jua', sans-serif" },
]

export default function GiftCardCustomizePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("templates")
  const [selectedTemplate, setSelectedTemplate] = useState(cardTemplates[0])
  const [selectedBackTemplate, setSelectedBackTemplate] = useState(cardTemplates[0])
  const [frontElements, setFrontElements] = useState<CardElementType[]>([])
  const [backElements, setBackElements] = useState<CardElementType[]>([])
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [customBackground, setCustomBackground] = useState<string | null>(null)
  const [customBackBackground, setCustomBackBackground] = useState<string | null>(null)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [editingTextContent, setEditingTextContent] = useState("")
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const backBackgroundInputRef = useRef<HTMLInputElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const [cardScale, setCardScale] = useState(1)

  // 선택된 요소 가져오기
  const selectedElement = isFlipped
    ? backElements.find((el) => el.id === selectedElementId)
    : frontElements.find((el) => el.id === selectedElementId)

  // 요소 선택 핸들러
  const handleSelectElement = (id: string) => {
    setSelectedElementId(id)

    const element = isFlipped ? backElements.find((el) => el.id === id) : frontElements.find((el) => el.id === id)

    if (element?.type === "text") {
      setEditingTextId(id)
      setEditingTextContent(element.content || "")
      // 도구 탭으로 자동 전환
      setActiveTab("tools")
    } else {
      setEditingTextId(null)
    }
  }

  // 요소 업데이트 핸들러
  const handleUpdateElement = (updatedElement: CardElementType) => {
    if (isFlipped) {
      setBackElements(backElements.map((el) => (el.id === updatedElement.id ? updatedElement : el)))
    } else {
      setFrontElements(frontElements.map((el) => (el.id === updatedElement.id ? updatedElement : el)))
    }
  }

  // 요소 삭제 핸들러
  const handleDeleteElement = (id: string) => {
    if (isFlipped) {
      setBackElements(backElements.filter((el) => el.id !== id))
    } else {
      setFrontElements(frontElements.filter((el) => el.id !== id))
    }

    if (selectedElementId === id) {
      setSelectedElementId(null)
      setEditingTextId(null)
    }
  }

 // 이미지 추가 핸들러
 const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // 파일 크기 제한 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("이미지 크기는 5MB 이하여야 합니다.")
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    if (!event.target?.result) {
      console.error("이미지를 읽을 수 없습니다.")
      return
    }

    try {
      // 이미지 데이터 압축 또는 최적화 로직을 추가할 수 있습니다
      const imageData = event.target.result as string

      // 이미지 데이터 유효성 검사
      if (!imageData.startsWith("data:image/")) {
        throw new Error("유효하지 않은 이미지 형식입니다.")
      }

      console.log("이미지 데이터 로드 성공:", imageData.substring(0, 50) + "...")

      // 이미지 미리 로드하여 유효성 확인
      const img = new Image()
      img.onload = () => {
        const newElement: CardElementType = {
          id: uuidv4(),
          type: "image",
          src: imageData,
          x: 50,
          y: 50,
          width: 150,
          height: 150,
          rotation: 0,
          zIndex: isFlipped ? backElements.length + 1 : frontElements.length + 1,
        }

        if (isFlipped) {
          setBackElements((prev) => [...prev, newElement])
        } else {
          setFrontElements((prev) => [...prev, newElement])
        }

        setSelectedElementId(newElement.id)
      }

      img.onerror = () => {
        console.error("이미지 로드 실패")
        alert("이미지를 로드할 수 없습니다. 다른 이미지를 선택해주세요.")
      }

      img.src = imageData
    } catch (error) {
      console.error("이미지 처리 중 오류 발생:", error)
      alert("이미지를 처리하는 중 오류가 발생했습니다.")
    }
  }

  reader.onerror = (error) => {
    console.error("이미지 읽기 오류:", error)
    alert("이미지를 읽을 수 없습니다.")
  }

  reader.readAsDataURL(file)
}

  // 배경 이미지 추가 핸들러
  const handleAddBackgroundImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      // 이미지 로드 후 처리
      const img = new Image()
      img.onload = () => {
        // 이미지 크기 조정 로직을 추가할 수 있음
        if (isFlipped) {
          setCustomBackBackground(event.target?.result as string)
        } else {
          setCustomBackground(event.target?.result as string)
        }
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  // 배경 이미지 제거 핸들러
  const handleRemoveBackgroundImage = () => {
    if (isFlipped) {
      setCustomBackBackground(null)
    } else {
      setCustomBackground(null)
    }
  }

  // 스티커 추가 핸들러
  const handleAddSticker = (sticker: { id: string; src: string }) => {
    // 카드 중앙에 스티커 배치
    const newElement: CardElementType = {
      id: uuidv4(),
      type: "sticker",
      src: sticker.src,
      x: 160, // 카드 중앙 (400/2 - 40)
      y: 110, // 카드 중앙 (300/2 - 40)
      width: 60,
      height: 60,
      rotation: 0,
      zIndex: isFlipped ? backElements.length + 1 : frontElements.length + 1,
    }

    if (isFlipped) {
      setBackElements((prev) => [...prev, newElement])
    } else {
      setFrontElements((prev) => [...prev, newElement])
    }

    setSelectedElementId(newElement.id)
  }

  // 텍스트 추가 핸들러
  const handleAddText = () => {
    const newElement: CardElementType = {
      id: uuidv4(),
      type: "text",
      content: "텍스트를 입력하세요",
      x: 100,
      y: 125, // 카드 중앙에 가깝게 배치
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: isFlipped ? backElements.length + 1 : frontElements.length + 1,
      fontFamily: "inherit", // 기본 글꼴
    }

    if (isFlipped) {
      setBackElements((prev) => [...prev, newElement])
    } else {
      setFrontElements((prev) => [...prev, newElement])
    }

    setSelectedElementId(newElement.id)
    setEditingTextId(newElement.id)
    setEditingTextContent(newElement.content || "")
    // 도구 탭으로 자동 전환
    setActiveTab("tools")
  }

  // 텍스트 내용 변경 핸들러 - 입력 필드 값이 변경될 때마다 호출
  const handleTextContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value
    setEditingTextContent(newContent)

    // 실시간으로 텍스트 내용 업데이트
    if (editingTextId) {
      if (isFlipped) {
        const updatedElements = backElements.map((el) =>
          el.id === editingTextId ? { ...el, content: newContent } : el,
        )
        setBackElements(updatedElements)
      } else {
        const updatedElements = frontElements.map((el) =>
          el.id === editingTextId ? { ...el, content: newContent } : el,
        )
        setFrontElements(updatedElements)
      }
    }
  }

  // 글꼴 변경 핸들러
  const handleFontChange = (fontFamily: string) => {
    if (!selectedElementId) return

    const selectedElement = isFlipped
      ? backElements.find((el) => el.id === selectedElementId)
      : frontElements.find((el) => el.id === selectedElementId)

    if (!selectedElement || selectedElement.type !== "text") return

    if (isFlipped) {
      const updatedElements = backElements.map((el) => (el.id === selectedElementId ? { ...el, fontFamily } : el))
      setBackElements(updatedElements)
    } else {
      const updatedElements = frontElements.map((el) => (el.id === selectedElementId ? { ...el, fontFamily } : el))
      setFrontElements(updatedElements)
    }
  }

  // 템플릿 변경 핸들러
  const handleChangeTemplate = (template: typeof selectedTemplate) => {
    if (isFlipped) {
      setSelectedBackTemplate(template)
      // 사용자 정의 템플릿이 아닌 경우 배경 이미지 초기화
      if (!template.isCustom) {
        setCustomBackBackground(null)
      }
    } else {
      setSelectedTemplate(template)
      // 사용자 정의 템플릿이 아닌 경우 배경 이미지 초기화
      if (!template.isCustom) {
        setCustomBackground(null)
      }
    }
  }

  // 카드 외부 클릭 시 선택 해제
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setSelectedElementId(null)
      setEditingTextId(null)
    }
  }

  // 카드 뒤집기 핸들러
  const handleFlipCard = () => {
    setIsFlipping(true)
    setSelectedElementId(null)
    setEditingTextId(null)

    // 애니메이션 완료 후 상태 변경
    setTimeout(() => {
      setIsFlipped((prev) => !prev)
      setIsFlipping(false)
    }, 400)
  }

  // 메시지 변경 핸들러 - 뒷면에 메시지 자동 추가
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value
    setMessage(newMessage)

    // 뒷면에 메시지 요소가 있는지 확인
    const messageElement = backElements.find((el) => el.id === "message-element")

    if (messageElement) {
      // 기존 메시지 요소 업데이트
      const updatedElements = backElements.map((el) =>
        el.id === "message-element" ? { ...el, content: newMessage } : el,
      )
      setBackElements(updatedElements)
    } else if (newMessage) {
      // 새 메시지 요소 추가
      const newElement: CardElementType = {
        id: "message-element",
        type: "text",
        content: newMessage,
        x: 50,
        y: 120,
        width: 300,
        height: 150,
        rotation: 0,
        zIndex: backElements.length + 1,
        fontFamily: "'Gaegu', cursive", // 기본 글꼴을 손글씨로 설정
      }
      setBackElements((prev) => [...prev, newElement])
    }
  }

  // 받는 사람 변경 핸들러 - 뒷면에 받는 사람 자동 추가
  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRecipient = e.target.value
    setRecipientName(newRecipient)

    // 뒷면에 받는 사람 요소가 있는지 확인
    const recipientElement = backElements.find((el) => el.id === "recipient-element")

    if (recipientElement) {
      // 기존 받는 사람 요소 업데이트
      const updatedElements = backElements.map((el) =>
        el.id === "recipient-element" ? { ...el, content: `To. ${newRecipient}` } : el,
      )
      setBackElements(updatedElements)
    } else if (newRecipient) {
      // 새 받는 사람 요소 추가
      const newElement: CardElementType = {
        id: "recipient-element",
        type: "text",
        content: `To. ${newRecipient}`,
        x: 50,
        y: 50,
        width: 300,
        height: 50,
        rotation: 0,
        zIndex: backElements.length + 1,
        fontFamily: "'Noto Serif KR', serif", // 기본 글꼴을 명조체로 설정
      }
      setBackElements((prev) => [...prev, newElement])
    }
  }

  // 선물 카드 저장 및 다음 단계로 이동
  const handleSaveCard = () => {
    try {
      // 이미지 데이터 크기 확인 및 경고
      let totalSize = 0
      let largeImageFound = false

      // 앞면 요소 확인
      frontElements.forEach((el) => {
        if (el.type === "image" && el.src) {
          const size = (el.src.length * 2) / 1024 / 1024 // 대략적인 MB 크기
          totalSize += size
          if (size > 1) largeImageFound = true
        }
      })

      // 뒷면 요소 확인
      backElements.forEach((el) => {
        if (el.type === "image" && el.src) {
          const size = (el.src.length * 2) / 1024 / 1024 // 대략적인 MB 크기
          totalSize += size
          if (size > 1) largeImageFound = true
        }
      })

      // 경고 표시
      if (largeImageFound) {
        console.warn("큰 이미지가 포함되어 있습니다. 총 데이터 크기:", totalSize.toFixed(2) + "MB")
      }

      // 요소 배열이 비어있고 배경이 이미지인 경우 처리
      let finalFrontElements = [...frontElements]
      let finalBackElements = [...backElements]
      let finalFrontBackground = customBackground || selectedTemplate.background
      let finalBackBackground = customBackBackground || selectedBackTemplate.background

      // 앞면에 요소가 없고 배경이 이미지인 경우, 배경을 요소로 변환
      if (finalFrontElements.length === 0 && finalFrontBackground && finalFrontBackground.startsWith("data:image/")) {
        console.log("앞면 요소가 없고 배경이 이미지입니다. 요소로 변환합니다.")
        finalFrontElements = [
          {
            id: uuidv4(),
            type: "image",
            src: finalFrontBackground,
            x: 0,
            y: 0,
            width: 400,
            height: 300,
            rotation: 0,
            zIndex: 1,
          },
        ]
        finalFrontBackground = "white" // 배경을 흰색으로 설정
      }

      // 뒷면에 요소가 없고 배경이 이미지인 경우, 배경을 요소로 변환
      if (finalBackElements.length === 0 && finalBackBackground && finalBackBackground.startsWith("data:image/")) {
        console.log("뒷면 요소가 없고 배경이 이미지입니다. 요소로 변환합니다.")
        finalBackElements = [
          {
            id: uuidv4(),
            type: "image",
            src: finalBackBackground,
            x: 0,
            y: 0,
            width: 400,
            height: 300,
            rotation: 0,
            zIndex: 1,
          },
        ]
        finalBackBackground = "white" // 배경을 흰색으로 설정
      }

      // 카드 데이터 저장
      const cardData = {
        frontElements: finalFrontElements,
        backElements: finalBackElements,
        frontTemplate: {
          id: selectedTemplate.id,
          background: finalFrontBackground,
        },
        backTemplate: {
          id: selectedBackTemplate.id,
          background: finalBackBackground,
        },
        isFlipped,
        message,
        recipientName,
      }

      // 디버깅용 로그 추가
      console.log("저장할 카드 데이터:", JSON.stringify(cardData).substring(0, 200) + "...")
      console.log("총 데이터 크기:", JSON.stringify(cardData).length / 1024 / 1024, "MB")
      console.log("프론트 요소 수:", finalFrontElements.length)
      console.log("백 요소 수:", finalBackElements.length)

      // localStorage에 카드 데이터 저장
      try {
        localStorage.setItem(`card-data-${params.id}`, JSON.stringify(cardData))
        console.log("카드 데이터가 성공적으로 저장되었습니다.")
      } catch (storageError) {
        console.error("localStorage 저장 오류:", storageError)
        alert("카드 데이터가 너무 큽니다. 이미지 크기를 줄이거나 개수를 줄여주세요.")
        return
      }

      // 결제 페이지로 이동
      router.push(`/gift/${params.id}/payment`)
    } catch (error) {
      console.error("카드 데이터 저장 중 오류 발생:", error)
      alert("카드 데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  // 페이지 로드 시 localStorage에서 카드 데이터 불러오기
  useEffect(() => {
    // URL에서 쿼리 파라미터 확인
    const searchParams = new URLSearchParams(window.location.search)
    const isEditMode = searchParams.get("edit") === "true"

    // 수정 모드일 때만 저장된 데이터 불러오기
    if (isEditMode) {
      try {
        const savedCardData = localStorage.getItem(`card-data-${params.id}`)
        if (savedCardData) {
          const parsedData = JSON.parse(savedCardData)
          console.log("저장된 카드 데이터 불러오기:", parsedData)

          // 프론트 요소 설정
          if (parsedData.frontElements && Array.isArray(parsedData.frontElements)) {
            setFrontElements(parsedData.frontElements)
          }

          // 백 요소 설정
          if (parsedData.backElements && Array.isArray(parsedData.backElements)) {
            setBackElements(parsedData.backElements)
          }

          // 템플릿 설정
          if (parsedData.frontTemplate) {
            const frontTemplateId = parsedData.frontTemplate.id
            const foundTemplate = cardTemplates.find((t) => t.id === frontTemplateId) || cardTemplates[0]
            setSelectedTemplate(foundTemplate)

            // 커스텀 배경 설정
            if (
              parsedData.frontTemplate.background &&
              (parsedData.frontTemplate.background.startsWith("data:") ||
                parsedData.frontTemplate.background.startsWith("#"))
            ) {
              setCustomBackground(parsedData.frontTemplate.background)
            }
          }

          // 백 템플릿 설정
          if (parsedData.backTemplate) {
            const backTemplateId = parsedData.backTemplate.id
            const foundBackTemplate = cardTemplates.find((t) => t.id === backTemplateId) || cardTemplates[0]
            setSelectedBackTemplate(foundBackTemplate)

            // 커스텀 배경 설정
            if (
              parsedData.backTemplate.background &&
              (parsedData.backTemplate.background.startsWith("data:") ||
                parsedData.backTemplate.background.startsWith("#"))
            ) {
              setCustomBackBackground(parsedData.backTemplate.background)
            }
          }

          // 메시지와 받는 사람 설정
          if (parsedData.message) {
            setMessage(parsedData.message)
          }

          if (parsedData.recipientName) {
            setRecipientName(parsedData.recipientName)
          }

          // 카드 뒤집기 상태 설정
          if (parsedData.isFlipped !== undefined) {
            setIsFlipped(parsedData.isFlipped)
          }
        }
      } catch (error) {
        console.error("카드 데이터 불러오기 실패:", error)
      }
    } else {
      // 수정 모드가 아닐 경우 기본값으로 초기화
      console.log("새로운 카드 만들기 모드")
      setFrontElements([])
      setBackElements([])
      setSelectedTemplate(cardTemplates[0])
      setSelectedBackTemplate(cardTemplates[0])
      setCustomBackground(null)
      setCustomBackBackground(null)
      setMessage("")
      setRecipientName("")
      setIsFlipped(false)
    }
  }, [params.id])


  // 배경 클릭 시 선택 해제를 위한 이벤트 리스너
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 편집기 영역 클릭은 무시
      if (editorRef.current && editorRef.current.contains(e.target as Node)) {
        return
      }

      // 카드 영역 외부 클릭 시 선택 해제
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setSelectedElementId(null)
        setEditingTextId(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // 텍스트 요소가 선택되면 텍스트 입력 필드에 포커스
  useEffect(() => {
    if (editingTextId && textInputRef.current) {
      textInputRef.current.focus()
    }
  }, [editingTextId])

  // 메시지나 받는 사람이 변경될 때 자동으로 뒷면에 요소 추가
  useEffect(() => {
    // 메시지가 있고 뒷면에 메시지 요소가 없는 경우
    if (message && !backElements.find((el) => el.id === "message-element")) {
      const newElement: CardElementType = {
        id: "message-element",
        type: "text",
        content: message,
        x: 50,
        y: 120,
        width: 300,
        height: 150,
        rotation: 0,
        zIndex: backElements.length + 1,
        fontFamily: "'Gaegu', cursive", // 기본 글꼴을 손글씨로 설정
      }
      setBackElements((prev) => [...prev, newElement])
    }

    // 받는 사람이 있고 뒷면에 받는 사람 요소가 없는 경우
    if (recipientName && !backElements.find((el) => el.id === "recipient-element")) {
      const newElement: CardElementType = {
        id: "recipient-element",
        type: "text",
        content: `To. ${recipientName}`,
        x: 50,
        y: 50,
        width: 300,
        height: 50,
        rotation: 0,
        zIndex: backElements.length + 1,
        fontFamily: "'Noto Serif KR', serif", // 기본 글꼴을 명조체로 설정
      }
      setBackElements((prev) => [...prev, newElement])
    }
  }, [message, recipientName, backElements])

  // 디버깅용 로그
  useEffect(() => {
    console.log("Front elements:", frontElements)
    console.log("Back elements:", backElements)
    console.log("Is flipped:", isFlipped)
    console.log("Selected template:", selectedTemplate)
    console.log("Selected back template:", selectedBackTemplate)
  }, [frontElements, backElements, isFlipped, selectedTemplate, selectedBackTemplate])

  // 카드 크기 및 스케일 계산을 위한 useEffect
  useEffect(() => {
    const updateCardScale = () => {
      if (cardRef.current) {
        // 기준 크기 (데스크탑 기준 카드 크기)
        const baseWidth = 400 // 기준 카드 너비를 400px로 설정

        // 현재 컨테이너 크기
        const containerWidth = cardRef.current.clientWidth

        // 스케일 계산
        const scale = containerWidth / baseWidth
        setCardScale(scale)
      }
    }

    // 초기 로드 시 스케일 계산
    updateCardScale()

    // 윈도우 리사이즈 이벤트에 대한 리스너 추가
    const handleResize = () => {
      updateCardScale()
    }

    window.addEventListener("resize", handleResize)

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">선물 카드 만들기</h1>
            <p className="text-gray-500">
              선물과 함께 전달할 카드를 만들어보세요. 템플릿을 선택하고 사진, 스티커, 메시지를 추가할 수 있습니다.
              카드를 뒤집어 앞면과 뒷면을 모두 꾸며보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 왼쪽: 카드 편집 영역 */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="perspective-1000 w-full max-w-full mb-4 relative overflow-visible">
                <div
                  ref={cardRef}
                  className={cn(
                    "relative w-full aspect-[4/3] rounded-lg shadow-lg", // overflow-hidden 제거
                    isFlipping ? "animate-flip" : "",
                    isFlipped ? "rotate-y-180" : "",
                  )}
                  onClick={handleCardClick}
                  style={{
                    maxWidth: "100%", // 최대 너비 제한
                    margin: "0 auto", // 중앙 정렬
                    boxSizing: "border-box", // 패딩과 테두리를 너비에 포함
                  }}
                >
                  {/* 카드 앞면 */}
                  <div
                    className="absolute inset-0 backface-hidden overflow-hidden"
                    style={{
                      backgroundImage:
                        selectedTemplate.isCustom && customBackground
                          ? `url(${customBackground})`
                          : selectedTemplate.background.startsWith("url") ||
                              selectedTemplate.background.startsWith("linear-gradient")
                            ? selectedTemplate.background
                            : "none",
                      backgroundColor:
                        selectedTemplate.isCustom && customBackground
                          ? "transparent"
                          : !selectedTemplate.background.startsWith("url") &&
                              !selectedTemplate.background.startsWith("linear-gradient")
                            ? selectedTemplate.background
                            : "transparent",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      visibility: isFlipped ? "hidden" : "visible",
                      width: "100%",
                      height: "100%",
                      // overflow: "hidden" 속성 제거
                    }}
                  >
                    {/* 사용자 정의 템플릿이 선택되었지만 배경 이미지가 없는 경우 안내 메시지 표시 */}
                    {selectedTemplate.isCustom && !customBackground && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mb-2"
                        >
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                        <p className="text-center px-4">
                          배경 이미지를 선택해주세요.
                          <br />
                          오른쪽 사이드바에서 &apos;배경 이미지 선택&apos; 버튼을 클릭하세요.
                        </p>
                        <Button variant="outline" className="mt-4" onClick={() => backgroundInputRef.current?.click()}>
                          배경 이미지 선택
                        </Button>
                      </div>
                    )}

                    {/* 카드 앞면 요소들 */}
                    {frontElements.map((element) => (
                      <CardElement
                        key={element.id}
                        element={element}
                        isSelected={!isFlipped && selectedElementId === element.id}
                        onSelect={() => handleSelectElement(element.id)}
                        onUpdate={handleUpdateElement}
                        onDelete={() => handleDeleteElement(element.id)}
                        isCardFlipped={false}
                        scale={cardScale}
                      />
                    ))}
                  </div>

                  {/* 카드 뒷면 */}
                  <div
                    className="absolute inset-0 backface-hidden overflow-hidden"
                    style={{
                      backgroundImage:
                        selectedBackTemplate.isCustom && customBackBackground
                          ? customBackBackground.startsWith("data:")
                            ? `url(${customBackBackground})`
                            : customBackBackground.startsWith("url") ||
                                customBackBackground.startsWith("linear-gradient")
                              ? customBackBackground
                              : "none"
                          : selectedBackTemplate.background.startsWith("url") ||
                              selectedBackTemplate.background.startsWith("linear-gradient")
                            ? selectedBackTemplate.background
                            : "none",
                      backgroundColor:
                        selectedBackTemplate.isCustom && customBackBackground
                          ? customBackBackground.startsWith("data:")
                            ? "transparent"
                            : !customBackBackground.startsWith("url") &&
                                !customBackBackground.startsWith("linear-gradient")
                              ? customBackBackground
                              : "transparent"
                          : !selectedBackTemplate.background.startsWith("url") &&
                              !selectedBackTemplate.background.startsWith("linear-gradient")
                            ? selectedBackTemplate.background
                            : "transparent",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)",
                      visibility: isFlipped ? "visible" : "hidden",
                      width: "100%",
                      height: "100%",
                      // overflow: "hidden" 속성 제거
                    }}
                  >
                    {/* 카드 뒷면 요소들을 감싸는 컨테이너 추가 - 반전 효과 상쇄 */}
                    <div className="relative w-full h-full" style={{ transform: "rotateY(180deg)" }}>
                      {backElements.map((element) => (
                        <CardElement
                          key={element.id}
                          element={element}
                          isSelected={isFlipped && selectedElementId === element.id}
                          onSelect={() => handleSelectElement(element.id)}
                          onUpdate={handleUpdateElement}
                          onDelete={() => handleDeleteElement(element.id)}
                          isCardFlipped={false}
                          scale={cardScale}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* 카드 뒤집기 버튼 */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-3 right-3 z-10"
                  onClick={handleFlipCard}
                  disabled={isFlipping}
                >
                  <Repeat className="h-4 w-4 mr-1" />
                  {isFlipped ? "앞면 보기" : "뒷면 보기"}
                </Button>
              </div>

              {/* 메시지 입력 영역 */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">메시지 작성 (카드 뒷면에 표시됩니다)</h3>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="recipient" className="block text-sm mb-1 flex items-center">
                      <User className="h-4 w-4 mr-1" /> 받는 사람
                    </label>
                    <Input
                      id="recipient"
                      placeholder="받는 사람의 이름을 입력하세요"
                      value={recipientName}
                      onChange={handleRecipientChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm mb-1 flex items-center">
                      <Mail className="h-4 w-4 mr-1" /> 메시지
                    </label>
                    <Textarea
                      id="message"
                      placeholder="마음을 담은 메시지를 작성해보세요."
                      rows={4}
                      value={message}
                      onChange={handleMessageChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 사이드바 */}
            <div className="bg-gray-50 rounded-lg p-4 h-[600px] flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="templates">템플릿</TabsTrigger>
                  <TabsTrigger value="stickers">스티커</TabsTrigger>
                  <TabsTrigger value="tools">도구</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="templates" className="h-[500px] overflow-y-auto pr-2">
                    <div className="flex flex-col space-y-4">
                      <h3 className="font-medium">{isFlipped ? "카드 뒷면 템플릿" : "카드 앞면 템플릿"}</h3>

                      {/* 템플릿 카테고리 필터 */}
                      <div className="flex flex-wrap gap-2 pb-2">
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                          onClick={() => {
                            /* 모든 카테고리 필터링 로직 */
                          }}
                        >
                          전체
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 생일 카테고리 필터링 로직 */
                          }}
                        >
                          생일
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 축하 카테고리 필터링 로직 */
                          }}
                        >
                          축하
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 감사 카테고리 필터링 로직 */
                          }}
                        >
                          감사
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 사랑 카테고리 필터링 로직 */
                          }}
                        >
                          사랑
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 일반 카테고리 필터링 로직 */
                          }}
                        >
                          일반
                        </button>
                      </div>

                      {/* 템플릿 그리드 */}
                      <div className="grid grid-cols-2 gap-2">
                        {cardTemplates.map((template) => (
                          <div
                            key={template.id}
                            className={cn(
                              "cursor-pointer rounded-md overflow-hidden border-2 transition-all hover:shadow-sm relative",
                              (isFlipped ? selectedBackTemplate.id : selectedTemplate.id) === template.id
                                ? "border-primary"
                                : "border-transparent",
                            )}
                            onClick={() => handleChangeTemplate(template)}
                          >
                            {template.isCustom ? (
                              <div className="aspect-[4/3] relative bg-gray-100 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                    <circle cx="12" cy="13" r="3" />
                                  </svg>
                                </div>
                                <span className="text-sm">나만의 사진으로</span>
                              </div>
                            ) : (
                              <div className="aspect-[4/3] relative">
                                <div
                                  className="w-full h-full"
                                  style={{
                                    backgroundImage:
                                      template.background.startsWith("url") ||
                                      template.background.startsWith("linear-gradient")
                                        ? template.background
                                        : "none",
                                    backgroundColor:
                                      !template.background.startsWith("url") &&
                                      !template.background.startsWith("linear-gradient")
                                        ? template.background
                                        : "transparent",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#333",
                                  }}
                                >
                                  {template.name}
                                </div>
                              </div>
                            )}
                            <div className="p-1 text-xs text-center truncate">{template.name}</div>

                            {/* 선택된 템플릿이 나만의 사진이고 배경이 있는 경우 X 버튼 표시 */}
                            {(isFlipped ? selectedBackTemplate.id : selectedTemplate.id) === template.id &&
                              template.isCustom &&
                              (isFlipped
                                ? customBackBackground && customBackBackground !== "#f8f9fa"
                                : customBackground) && (
                                <button
                                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveBackgroundImage()
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                  </svg>
                                </button>
                              )}
                          </div>
                        ))}
                      </div>

                      {/* 배경 이미지 업로드를 위한 숨겨진 input */}
                      <input
                        type="file"
                        ref={backgroundInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAddBackgroundImage}
                      />

                      {/* 뒷면 배경 이미지 업로드를 위한 숨겨진 input */}
                      <input
                        type="file"
                        ref={backBackgroundInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAddBackgroundImage}
                      />

                      {/* 배경 관련 컨트롤 표시 */}
                      <div className="mt-4 border rounded-md p-3 bg-white">
                        <h4 className="font-medium text-sm mb-2">
                          {isFlipped ? "뒷면 배경 이미지" : "앞면 배경 이미지"}
                        </h4>

                        {isFlipped ? (
                          // 뒷면 배경 컨트롤
                          <div className="space-y-3">
                            {/* 배경 미리보기 스타일 수정 */}
                            <div className="aspect-[4/3] relative rounded overflow-hidden">
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundImage: customBackBackground
                                    ? customBackBackground.startsWith("data:")
                                      ? `url(${customBackBackground})`
                                      : customBackBackground.startsWith("url") ||
                                          customBackBackground.startsWith("linear-gradient")
                                        ? customBackBackground
                                        : "none"
                                    : selectedBackTemplate.background.startsWith("url") ||
                                        selectedBackTemplate.background.startsWith("linear-gradient")
                                      ? selectedBackTemplate.background
                                      : "none",
                                  backgroundColor: customBackBackground
                                    ? customBackBackground.startsWith("data:")
                                      ? "transparent"
                                      : !customBackBackground.startsWith("url") &&
                                          !customBackBackground.startsWith("linear-gradient")
                                        ? customBackBackground
                                        : "transparent"
                                    : !selectedBackTemplate.background.startsWith("url") &&
                                        !selectedBackTemplate.background.startsWith("linear-gradient")
                                      ? selectedBackTemplate.background
                                      : "transparent",
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                }}
                              ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <ImageHandler
                                onImageSelected={(imageData) => {
                                  console.log("이미지 선택됨:", imageData.substring(0, 50) + "...")

                                  // 새 요소 생성
                                  const newElement: CardElementType = {
                                    id: uuidv4(),
                                    type: "image",
                                    src: imageData,
                                    x: 50,
                                    y: 50,
                                    width: 150,
                                    height: 150,
                                    rotation: 0,
                                    zIndex: isFlipped ? backElements.length + 1 : frontElements.length + 1,
                                  }

                                  // 요소 배열에 추가
                                  if (isFlipped) {
                                    setBackElements((prev) => {
                                      const newElements = [...prev, newElement]
                                      console.log("백 요소 추가됨:", newElements.length)
                                      return newElements
                                    })
                                  } else {
                                    setFrontElements((prev) => {
                                      const newElements = [...prev, newElement]
                                      console.log("프론트 요소 추가됨:", newElements.length)
                                      return newElements
                                    })
                                  }

                                  // 선택된 요소 ID 설정
                                  setSelectedElementId(newElement.id)
                                }}
                                buttonText="변경하기"
                                variant="outline"
                              />
                              <Button variant="outline" size="sm" onClick={handleRemoveBackgroundImage}>
                                기본으로 변경
                              </Button>
                            </div>

                            {/* 뒷면 배경색 선택 */}
                            <div className="mt-2">
                              <label className="block text-xs mb-1">배경색 선택</label>
                              <div className="grid grid-cols-5 gap-1">
                                {[
                                  "#f8f9fa",
                                  "#e9ecef",
                                  "#dee2e6",
                                  "#ffe8cc",
                                  "#d8f3dc",
                                  "#d0f4de",
                                  "#e4c1f9",
                                  "#ffccd5",
                                  "#caffbf",
                                ].map((color) => (
                                  <button
                                    key={color}
                                    className={cn(
                                      "w-full h-8 rounded border",
                                      customBackBackground === color ? "ring-2 ring-primary" : "ring-0",
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setCustomBackBackground(color)}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ) : // 앞면 배경 컨트롤
                        selectedTemplate.isCustom ? (
                          customBackground ? (
                            <div className="space-y-3">
                              <div className="aspect-[4/3] relative rounded overflow-hidden">
                                <div
                                  className="w-full h-full"
                                  style={{
                                    backgroundImage: `url(${customBackground})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                  }}
                                ></div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <ImageHandler
                                  onImageSelected={(imageData) => {
                                    setCustomBackground(imageData)
                                  }}
                                  buttonText="배경 이미지 선택"
                                />
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => backgroundInputRef.current?.click()}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                              </svg>
                              배경 이미지 선택
                            </Button>
                          )
                        ) : (
                          <div className="text-sm text-gray-500 text-center py-2">
                            사용자 정의 템플릿을 선택하면 배경 이미지를 변경할 수 있습니다.
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>


                  <TabsContent value="stickers" className="h-[500px] overflow-y-auto pr-2">
                    <div className="flex flex-col space-y-4">
                      <h3 className="font-medium">{isFlipped ? "뒷면 스티커 추가" : "앞면 스티커 추가"}</h3>

                      {/* 스티커 카테고리 필터 */}
                      <div className="flex flex-wrap gap-2 pb-2">
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                          onClick={() => {
                            /* 모든 카테고리 필터링 로직 */
                          }}
                        >
                          전체
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 생일 카테고리 필터링 로직 */
                          }}
                        >
                          생일
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 축하 카테고리 필터링 로직 */
                          }}
                        >
                          축하
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 사랑 카테고리 필터링 로직 */
                          }}
                        >
                          사랑
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 장식 카테고리 필터링 로직 */
                          }}
                        >
                          장식
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 음식 카테고리 필터링 로직 */
                          }}
                        >
                          음식
                        </button>
                        <button
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          onClick={() => {
                            /* 이모티콘 카테고리 필터링 로직 */
                          }}
                        >
                          이모티콘
                        </button>
                      </div>

                      {/* 스티커 그리드 */}
                      <div className="grid grid-cols-3 gap-2">
                        {stickers.map((sticker) => (
                          <div
                            key={sticker.id}
                            className="cursor-pointer rounded-md overflow-hidden border hover:border-primary p-2 transition-all hover:shadow-sm"
                            onClick={() => handleAddSticker(sticker)}
                          >
                            <div className="aspect-square relative flex items-center justify-center bg-white">
                              <div className="text-2xl">
                                {sticker.src.includes("text=")
                                  ? sticker.src.split("text=")[1].replace(/%20/g, " ")
                                  : "🔍"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tools" className="h-[500px] overflow-y-auto pr-2">
                    <div className="flex flex-col space-y-4">
                      <h3 className="font-medium">{isFlipped ? "뒷면 도구" : "앞면 도구"}</h3>
                      <div className="grid gap-3">
                      <ImageHandler
                          onImageSelected={(imageData) => {
                            const newElement: CardElementType = {
                              id: uuidv4(),
                              type: "image",
                              src: imageData,
                              x: 50,
                              y: 50,
                              width: 150,
                              height: 150,
                              rotation: 0,
                              zIndex: isFlipped ? backElements.length + 1 : frontElements.length + 1,
                            }

                            if (isFlipped) {
                              setBackElements((prev) => [...prev, newElement])
                            } else {
                              setFrontElements((prev) => [...prev, newElement])
                            }

                            setSelectedElementId(newElement.id)
                          }}
                          buttonText="사진 추가"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleAddImage}
                        />

                        <Button variant="outline" className="justify-start" onClick={handleAddText}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="4 7 4 4 20 4 20 7" />
                            <line x1="9" y1="20" x2="15" y2="20" />
                            <line x1="12" y1="4" x2="12" y2="20" />
                          </svg>
                          텍스트 추가
                        </Button>

                        {selectedElement && (
                          <div
                            ref={editorRef}
                            className="border rounded-md p-3 mt-4"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                          >
                            <h4 className="font-medium text-sm mb-2">선택된 요소 편집</h4>

                            {/* 텍스트 요소가 선택된 경우 텍스트 편집 UI 표시 */}
                            {selectedElement.type === "text" && (
                              <div className="space-y-3">
                                {/* 글꼴 선택 버튼 */}
                                <div className="mb-3">
                                  <label className="block text-xs mb-1">글꼴 선택</label>
                                  <div className="grid grid-cols-5 gap-1">
                                    {fontOptions.map((font) => (
                                      <button
                                        key={font.value}
                                        type="button"
                                        className={cn(
                                          "text-xs px-2 py-1 border rounded hover:bg-gray-100",
                                          selectedElement.fontFamily === font.value
                                            ? "border-primary bg-primary/10"
                                            : "border-gray-200",
                                        )}
                                        style={{ fontFamily: font.value }}
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleFontChange(font.value)
                                        }}
                                      >
                                        {font.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <label htmlFor="text-content" className="block text-xs mb-1">
                                    텍스트 내용
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="text-content"
                                      ref={textInputRef}
                                      value={editingTextContent}
                                      onChange={handleTextContentChange}
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onTouchStart={(e) => e.stopPropagation()}
                                      className="text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteElement(selectedElement.id)
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                              </svg>
                              삭제하기
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={handleSaveCard}>
              카드 저장하고 계속하기
            </Button>
          </div>
        </div>
      </main>
      <Footer />

      {/* 카드 뒤집기 애니메이션을 위한 CSS */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .transition-transform {
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        
        .duration-800 {
          transition-duration: 800ms;
        }
        
        @keyframes flip {
          0% {
            transform: ${isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
          }
          100% {
            transform: ${isFlipped ? "rotateY(0deg)" : "rotateY(180deg)"};
          }
        }
        
        .animate-flip {
          animation: flip 0.8s;
        }
        
        /* 반응형 카드 요소를 위한 추가 스타일 */
        @media (max-width: 768px) {
          .perspective-1000 {
            max-width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  )
}

