import { IProductRequest, IProductRequestUpdate } from "@/interfaces/Product";
import { apiRequest } from "@/utils/api";

export async function InsertProduct(obj: IProductRequest) {
  try {
    const res = await apiRequest("/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function FindAllProducts() {
  try {
    const res = await apiRequest(`/products`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function FindByIdProduct(id: number) {
  try {
    const res = await apiRequest(`/products/${id}`, {
      method: "GET",
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function UpdateProduct(id: number, obj: IProductRequestUpdate) {
  try {
    const res = await apiRequest(`/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function DeleteProduct(id: number) {
  try {
    await apiRequest(`/products/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw error;
  }
}
