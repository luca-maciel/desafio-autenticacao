import api from "./api";
import { getToken } from "./storage";

export async function getAuthenticatedUser() {
  const token = await getToken();

  if (!token) {
    return null;
  }

  const response = await api.get("/auth/me");

  return response.data;
}