export interface CardElement {
  id: string
  type: "image" | "sticker" | "text"
  src?: string
  content?: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  fontFamily?: string
}

export type CardElementType = CardElement

