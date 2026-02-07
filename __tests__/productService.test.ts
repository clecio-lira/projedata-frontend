import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  InsertProduct,
  FindAllProducts,
  FindByIdProduct,
  UpdateProduct,
  DeleteProduct,
} from "@/services/Product";
import { apiRequest } from "@/utils/api";
import {
  IProductRequest,
  IProductRequestUpdate,
  IProductResponse,
} from "@/interfaces/Product";

vi.mock("@/utils/api", () => ({
  apiRequest: vi.fn(),
}));

describe("Product Service - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar apiRequest com POST e body JSON ao inserir produto", async () => {
    const mockProduct: IProductRequest = {
      code: "PROD-T-01",
      name: "Teclado",
      price: 100,
      rawMaterials: [{ rawMaterialId: 1, quantityNeeded: 2 }],
    };
    vi.mocked(apiRequest).mockResolvedValue({ id: 1, ...mockProduct });

    const res = await InsertProduct(mockProduct as IProductRequest);

    expect(apiRequest).toHaveBeenCalledWith("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockProduct),
    });
    expect(res).toHaveProperty("id", 1);
  });

  it("deve chamar apiRequest com GET para listar todos os produtos", async () => {
    const mockList: IProductResponse[] = [
      { id: 1, code: "PROD-P1", name: "P1", price: 50 },
      { id: 2, code: "PROD-P2", name: "P2", price: 75 },
    ];
    vi.mocked(apiRequest).mockResolvedValue(mockList);

    const res = await FindAllProducts();

    expect(apiRequest).toHaveBeenCalledWith("/products", { method: "GET" });
    expect(res).toEqual(mockList);
  });

  it("deve formatar a URL corretamente com o ID no FindByIdProduct", async () => {
    const id = 99;
    vi.mocked(apiRequest).mockResolvedValue({
      id,
      code: "PROD-99",
      name: "Produto 99",
      price: 150,
    });

    await FindByIdProduct(id);

    expect(apiRequest).toHaveBeenCalledWith(`/products/${id}`, {
      method: "GET",
    });
  });

  it("deve chamar apiRequest com PUT, ID na URL e body correto no UpdateProduct", async () => {
    const id = 50;
    const updateData = { name: "Nome Atualizado" };
    vi.mocked(apiRequest).mockResolvedValue({ id, ...updateData });

    const res = await UpdateProduct(id, updateData as IProductRequestUpdate);

    expect(apiRequest).toHaveBeenCalledWith(`/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    expect(res.name).toBe("Nome Atualizado");
  });

  it("deve chamar apiRequest com DELETE e o ID correto", async () => {
    const id = 10;
    vi.mocked(apiRequest).mockResolvedValue({});

    await DeleteProduct(id);

    expect(apiRequest).toHaveBeenCalledWith(`/products/${id}`, {
      method: "DELETE",
    });
  });

  it("deve propagar o erro caso a apiRequest falhe", async () => {
    vi.mocked(apiRequest).mockRejectedValue(new Error("Erro de Servidor"));

    await expect(FindAllProducts()).rejects.toThrow("Erro de Servidor");
  });
});
