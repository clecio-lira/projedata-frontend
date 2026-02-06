import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export async function GetSuggestions() {
  try {
    const res = await apiRequest(`/production/suggestion`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    toast.error("Erro ao buscar as sugestões.");
  }
}
