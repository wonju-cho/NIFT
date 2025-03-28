"use client"

import { useRouter } from "next/navigation"
import { Repeat } from "lucide-react"
import { stickers } from "@/data/stickers"
import { cardTemplates } from "@/data/card-templates"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCardEditor } from "@/hooks/use-card-editor"
import { CardFace } from "@/components/gift/card-face"
import { TemplateSelector } from "@/components/gift/template-selector"
import { StickerSelector } from "@/components/gift/sticker-selector"
import { ToolsPanel } from "@/components/gift/tools-panel"
import { MessageForm } from "@/components/gift/message-form"
import { v4 as uuidv4 } from "uuid"
import { cn } from "@/lib/utils"

export default function GiftCardCustomizePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    activeTab,
    setActiveTab,
    selectedTemplate,
    selectedBackTemplate,
    frontElements,
    backElements,
    selectedElementId,
    setSelectedElementId,
    setFrontElements,
    setBackElements,
    selectedElement,
    message,
    recipientName,
    customBackground,
    customBackBackground,
    editingTextId,
    editingTextContent,
    isFlipped,
    isFlipping,
    cardScale,
    fileInputRef,
    backgroundInputRef,
    backBackgroundInputRef,
    cardRef,
    textInputRef,
    editorRef,
    handleSelectElement,
    handleUpdateElement,
    handleDeleteElement,
    handleAddImage,
    handleAddBackgroundImage,
    handleRemoveBackgroundImage,
    handleAddSticker,
    handleAddText,
    handleTextContentChange,
    handleFontChange,
    handleChangeTemplate,
    handleCardClick,
    handleFlipCard,
    handleMessageChange,
    handleRecipientChange,
    saveCardData,
  } = useCardEditor(params.id)

  // 선물 카드 저장 및 다음 단계로 이동
  const handleSaveCard = () => {
    if (saveCardData()) {
      router.push(`/gift/${params.id}/payment`)
    }
  }

  // 이미지 추가 핸들러 (ImageHandler 컴포넌트에서 사용)
  const handleAddImageFromHandler = (imageData: string) => {
    const newElement = {
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
                {/* 카드 컴포넌트 */}
                <div
                  ref={cardRef}
                  className={cn(
                    "relative w-full aspect-[4/3] rounded-lg shadow-lg",
                    isFlipping ? "animate-flip" : "",
                    isFlipped ? "rotate-y-180" : "",
                  )}
                  onClick={handleCardClick}
                  style={{
                    maxWidth: "100%",
                    margin: "0 auto",
                    boxSizing: "border-box",
                  }}
                >
                  {/* 앞면 */}
                  <CardFace
                    isFront={true}
                    isFlipped={isFlipped}
                    elements={frontElements}
                    template={selectedTemplate}
                    customBackground={customBackground}
                    selectedElementId={selectedElementId}
                    onSelectElement={handleSelectElement}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElement}
                    scale={cardScale}
                    backgroundInputRef={backgroundInputRef}
                  />

                  {/* 뒷면 */}
                  <CardFace
                    isFront={false}
                    isFlipped={isFlipped}
                    elements={backElements}
                    template={selectedBackTemplate}
                    customBackground={customBackBackground}
                    selectedElementId={selectedElementId}
                    onSelectElement={handleSelectElement}
                    onUpdateElement={handleUpdateElement}
                    onDeleteElement={handleDeleteElement}
                    scale={cardScale}
                  />
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
              <MessageForm
                recipientName={recipientName}
                message={message}
                onRecipientChange={handleRecipientChange}
                onMessageChange={handleMessageChange}
              />
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
                    <TemplateSelector
                      isFlipped={isFlipped}
                      templates={cardTemplates}
                      selectedTemplate={isFlipped ? selectedBackTemplate : selectedTemplate}
                      customBackground={isFlipped ? customBackBackground : customBackground}
                      customBackBackground={customBackBackground}
                      onChangeTemplate={handleChangeTemplate}
                      onRemoveBackground={handleRemoveBackgroundImage}
                      backgroundInputRef={backgroundInputRef}
                      backBackgroundInputRef={backBackgroundInputRef}
                    />
                  </TabsContent>

                  <TabsContent value="stickers" className="h-[500px] overflow-y-auto pr-2">
                    <StickerSelector isFlipped={isFlipped} stickers={stickers} onAddSticker={handleAddSticker} />
                  </TabsContent>

                  <TabsContent value="tools" className="h-[500px] overflow-y-auto pr-2">
                    <ToolsPanel
                      isFlipped={isFlipped}
                      selectedElement={selectedElement}
                      editingTextContent={editingTextContent}
                      onAddImage={handleAddImageFromHandler}
                      onAddText={handleAddText}
                      onTextContentChange={handleTextContentChange}
                      onFontChange={handleFontChange}
                      onDeleteElement={handleDeleteElement}
                      textInputRef={textInputRef}
                      editorRef={editorRef}
                    />
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

      {/* 이미지 업로드를 위한 숨겨진 input */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAddImage} />

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

