import { IRawMaterialRequest } from "@/interfaces/RawMaterial";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

export async function InsertRawMaterial(obj: IRawMaterialRequest) {
  try {
    const res = await apiRequest("/raw-materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return res;
  } catch (error) {
    toast.error("Erro ao criar a matéria-prima.");
  }
}

export async function FindAllRawMaterials() {
  try {
    const res = await apiRequest(`/raw-materials`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    toast.error("Erro ao buscar as matérias-primas.");
  }
}

export async function FindByIdRawMaterial(id: number) {
  try {
    const res = await apiRequest(`/raw-materials/${id}`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    toast.error("Erro ao buscar a matéria-prima.");
  }
}

export async function UpdateRawMaterial(id: number, obj: IRawMaterialRequest) {
  try {
    const res = await apiRequest(`/raw-materials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return res;
  } catch (error) {
    toast.error("Erro ao atualizar a matéria-prima.");
  }
}

export async function DeleteRawMaterial(id: number) {
  try {
    await apiRequest(`/raw-materials/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    toast.error("Erro ao remover matéria-prima.");
  }
}
