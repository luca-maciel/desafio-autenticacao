import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
    return;
  }

  await SecureStore.setItemAsync("token", token);
}

export async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }

  return await SecureStore.getItemAsync("token");
}

export async function removeToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
    return;
  }

  await SecureStore.deleteItemAsync("token");
}