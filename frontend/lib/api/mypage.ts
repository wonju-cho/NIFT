import { apiClient } from "./CustomAxios";

export const deleteUser = async () => {
  const response = await apiClient.delete("/users/me");
  return response;
};

export const updateUserNickname = async (nickname: string) => {
  const response = await apiClient.patch("/users/nickname", {
    nickname: nickname,
  });
  return response;
};

export const updateWallet = async (walletAddress: string) => {
  const response = await apiClient.patch("/users/wallet", {
    walletAddress: walletAddress,
  });
  return response;
};
