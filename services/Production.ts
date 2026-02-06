import { apiRequest } from "@/utils/api";

export async function GetSuggestions() {
  try {
    const res = await apiRequest(`/production/suggestion`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    throw error;
  }
}
