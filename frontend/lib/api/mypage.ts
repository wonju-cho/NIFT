import { apiClient } from "./CustomAxios";

export const deleteUser = async () => {
  const response = await apiClient.delete("/users/me");
  return response.data;
};
