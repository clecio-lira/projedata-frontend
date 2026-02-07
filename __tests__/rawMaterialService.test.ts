import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  InsertRawMaterial,
  FindAllRawMaterials,
  FindByIdRawMaterial,
  UpdateRawMaterial,
  DeleteRawMaterial,
} from "@/services/RawMaterial";
import { apiRequest } from "@/utils/api";
import {
  IRawMaterialRequest,
  IRawMaterialResponse,
} from "@/interfaces/RawMaterial";

vi.mock("@/utils/api", () => ({
  apiRequest: vi.fn(),
}));

describe("RawMaterial Service - Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve chamar apiRequest com POST e a rota de raw-materials", async () => {
    const mockRawMaterial: IRawMaterialRequest = {
      code: "RM-P-01",
      name: "Prego",
      stockQuantity: 100,
    };
    vi.mocked(apiRequest).mockResolvedValue({ id: 1, ...mockRawMaterial });

    const res = await InsertRawMaterial(mockRawMaterial);

    expect(apiRequest).toHaveBeenCalledWith("/raw-materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockRawMaterial),
    });
    expect(res).toHaveProperty("id", 1);
  });

  it("deve chamar apiRequest com GET para listar todas as matérias-primas", async () => {
    const mockList: IRawMaterialResponse[] = [
      { id: 1, code: "RM-M-01", name: "Madeira", stockQuantity: 50 },
      { id: 2, code: "RM-P-01", name: "Prego", stockQuantity: 100 },
    ];
    vi.mocked(apiRequest).mockResolvedValue(mockList);

    const res = await FindAllRawMaterials();

    expect(apiRequest).toHaveBeenCalledWith("/raw-materials", {
      method: "GET",
    });
    expect(res).toEqual(mockList);
    expect(res).toHaveLength(2);
  });

  it("deve buscar uma matéria-prima específica pelo ID", async () => {
    const id = 5;
    const mockRawMaterial: IRawMaterialRequest = {
      code: "RM-C-01",
      name: "Cimento",
      stockQuantity: 200,
    };
    vi.mocked(apiRequest).mockResolvedValue({ id, ...mockRawMaterial });

    await FindByIdRawMaterial(id);

    expect(apiRequest).toHaveBeenCalledWith(`/raw-materials/${id}`, {
      method: "GET",
    });
  });

  it("deve chamar apiRequest com PUT e o body de atualização", async () => {
    const id = 10;
    const updateData = { stockQuantity: 100 };
    vi.mocked(apiRequest).mockResolvedValue({ id, ...updateData });

    const res = await UpdateRawMaterial(id, updateData as IRawMaterialRequest);

    expect(apiRequest).toHaveBeenCalledWith(`/raw-materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    expect(res.stockQuantity).toBe(100);
  });

  it("deve enviar uma requisição DELETE para o ID correto", async () => {
    const id = 22;
    vi.mocked(apiRequest).mockResolvedValue({ success: true });

    await DeleteRawMaterial(id);

    expect(apiRequest).toHaveBeenCalledWith(`/raw-materials/${id}`, {
      method: "DELETE",
    });
  });

  it("deve propagar o erro caso a apiRequest falhe", async () => {
    vi.mocked(apiRequest).mockRejectedValue(new Error("Erro de Servidor"));

    await expect(FindAllRawMaterials()).rejects.toThrow("Erro de Servidor");
  });
});
