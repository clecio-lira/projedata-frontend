import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetSuggestions } from "@/services/Production";
import { apiRequest } from "@/utils/api";
import { IProductionReport } from "@/interfaces/Production";

vi.mock("@/utils/api", () => ({
  apiRequest: vi.fn(),
}));

describe("Production Service - GetSuggestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar o relatório de sugestões com a estrutura IProductionReport", async () => {
    const mockReport: IProductionReport = {
      totalProductionValue: 5000,
      produced: [
        {
          productId: 1,
          productName: "Produto A",
          quantity: 10,
          unitPrice: 100,
          totalValue: 1000,
        },
      ],
      notProduced: [
        {
          productId: 2,
          productName: "Produto B",
          reason: "Estoque insuficiente de Aço",
        },
      ],
    };

    vi.mocked(apiRequest).mockResolvedValue(mockReport);

    const res = await GetSuggestions();

    expect(apiRequest).toHaveBeenCalledWith("/production/suggestion", {
      method: "GET",
    });

    expect(res.totalProductionValue).toBe(5000);
    expect(res.produced).toHaveLength(1);
    expect(res.notProduced[0].reason).toBe("Estoque insuficiente de Aço");
  });

  it("deve propagar o erro caso a apiRequest falhe", async () => {
    vi.mocked(apiRequest).mockRejectedValue(new Error("Erro de Servidor"));

    await expect(GetSuggestions()).rejects.toThrow("Erro de Servidor");
  });
});
