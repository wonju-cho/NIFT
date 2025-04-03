export interface GiftMemory {
    id: string
    senderName: string
    senderNickname: string
    receiverName?: string
    receiverNickname?: string
    sentDate: string
    acceptedDate?: string
    isAccepted: boolean
    cardData?: {
      frontTemplate: {
        background: string
      }
      backTemplate: {
        background: string
      }
      frontElements: any[]
      backElements: any[]
    }
    giftItem?: {
      id: string
      title: string
      brand: string
      price: number
      image: string
    }
  }
  
  