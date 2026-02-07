describe("Relatório de Produção", () => {
  const suggestionURL = "**/production/suggestion";

  beforeEach(() => {
    cy.visit("http://localhost:3000/admin/producao");
  });

  it("deve exibir skeletons e carregar o valor total e a tabela de produzidos", () => {
    const mockData = {
      totalProductionValue: 1500.5,
      produced: [
        {
          productId: 1,
          productName: "Mesa",
          quantity: 2,
          unitPrice: 500,
          totalValue: 1000,
        },
        {
          productId: 2,
          productName: "Cadeira",
          quantity: 1,
          unitPrice: 500.5,
          totalValue: 500.5,
        },
      ],
      notProduced: [],
    };

    cy.intercept("GET", suggestionURL, {
      delay: 500,
      statusCode: 200,
      body: mockData,
    }).as("getProduction");

    cy.get(".animate-pulse").should("be.visible");

    cy.wait("@getProduction");

    cy.contains("R$ 1.500,50").should("be.visible");

    cy.get("table").contains("Mesa").should("be.visible");
    cy.get("table").contains("Cadeira").should("be.visible");
    cy.get("table").contains("R$ 500,50").should("be.visible");
  });

  it("deve exibir alerta de atenção quando houver itens não produzidos", () => {
    const mockDataWithErrors = {
      totalProductionValue: 0,
      produced: [],
      notProduced: [
        { productId: 3, productName: "Armário", reason: "Falta: Chapa de Aço" },
        {
          productId: 4,
          productName: "Prateleira",
          reason: "Sem matéria-prima vinculada",
        },
      ],
    };

    cy.intercept("GET", suggestionURL, {
      statusCode: 200,
      body: mockDataWithErrors,
    }).as("getProductionWithErrors");

    cy.wait("@getProductionWithErrors");

    cy.contains("Atenção: Itens não produzidos").should("be.visible");

    cy.contains("matéria-prima insuficiente: Chapa de Aço").should(
      "be.visible",
    );

    cy.contains("Este produto não possui matérias-primas vinculadas.").should(
      "be.visible",
    );
  });

  it("deve permitir tentar novamente em caso de erro de sistema", () => {
    cy.intercept("GET", suggestionURL, { statusCode: 500 }).as("getErrors");

    cy.wait("@getErrors");
    cy.contains("Erro de sistema").should("be.visible");

    cy.intercept("GET", suggestionURL, {
      statusCode: 200,
      body: { totalProductionValue: 100, produced: [], notProduced: [] },
    }).as("retrySuccess");

    cy.contains("button", "Tentar Novamente").click();

    cy.wait("@retrySuccess");
    cy.contains("R$ 100,00").should("be.visible");
  });

  it("deve atualizar os dados ao clicar no botão de atualizar", () => {
    cy.intercept("GET", suggestionURL, {
      statusCode: 200,
      body: { totalProductionValue: 50, produced: [], notProduced: [] },
    }).as("firstLoad");

    cy.wait("@firstLoad");

    cy.intercept("GET", suggestionURL, {
      statusCode: 200,
      body: { totalProductionValue: 999, produced: [], notProduced: [] },
    }).as("secondLoad");

    cy.contains("button", "Atualizar Dados").click();

    cy.wait("@secondLoad");
    cy.contains("R$ 999,00").should("be.visible");
  });
});
