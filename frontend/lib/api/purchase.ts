import { apiClient } from "./CustomAxios";

export interface PurchaseParams {
  articleId: number;
  txHash: string;
}

export const postPurchaseHash = async ({
  articleId,
  txHash,
}: PurchaseParams) => {
  try {
    await apiClient.post(`/secondhand-articles/${articleId}/purchase`, {
      txHash,
    });
  } catch (error) {
    console.error("구매 해시 전송 실패:", error);
    throw error;
  }
};
