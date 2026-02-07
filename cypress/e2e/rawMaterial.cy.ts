describe("Página de Materiais", () => {
  const apiURL = "**/raw-materials";

  beforeEach(() => {
    cy.visit("http://localhost:3000/admin/materia-prima");
  });

  it("deve exibir Skeletons enquanto carrega e depois mostrar a lista", () => {
    cy.intercept("GET", apiURL, {
      delay: 1000,
      statusCode: 200,
      body: [{ id: 1, code: "RM001", name: "Material Real", price: 100 }],
    }).as("getDelayedProducts");

    cy.get(".animate-pulse").should("have.length.at.least", 5);

    cy.wait("@getDelayedProducts");

    cy.contains("RM001").should("be.visible");
    cy.contains("Material Real").should("be.visible");
  });

  it("deve exibir o estado de erro e permitir tentar novamente", () => {
    cy.intercept("GET", apiURL, { statusCode: 500 }).as("getRawMaterialError");

    cy.wait("@getRawMaterialError");

    cy.contains("Erro de Sincronização").should("be.visible");
    cy.contains("Erro ao carregar dados.").should("be.visible");

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [{ id: 1, code: "RM002", name: "Material Real", price: 100 }],
    }).as("getRawMaterialsRetry");

    cy.contains("button", /tentar novamente/i).click();

    cy.wait("@getRawMaterialsRetry");
    cy.contains("Material Real").should("be.visible");
  });

  it("deve abrir o modal de criação e recarregar a lista após criar", () => {
    cy.intercept("GET", apiURL, { statusCode: 200, body: [] }).as(
      "initialLoad",
    );

    cy.intercept("POST", apiURL, { statusCode: 201 }).as("createRequest");

    cy.contains("button", "Criar Matéria-Prima").click();

    cy.get('input[id="code"]').type("NEW-01");
    cy.get('input[id="name"]').type("Material Novo");
    cy.get('input[id="stock"]').type("250");

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [{ id: 2, code: "NEW-01", name: "Material Novo", stock: 250 }],
    }).as("refreshList");

    cy.get('button[type="submit"]').click();

    cy.wait("@createRequest");
    cy.wait("@refreshList");

    cy.contains("NEW-01").should("be.visible");
  });

  it("deve abrir o modal de atualização e recarregar a lista após atualizar", () => {
    const materialToEdit = {
      id: 2,
      code: "NEW-01",
      name: "Material Antigo",
      stock: 250,
    };

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [materialToEdit],
    }).as("initialLoad");

    cy.intercept("GET", `${apiURL}/2`, {
      statusCode: 200,
      body: materialToEdit,
    }).as("findById");

    cy.intercept("PUT", `${apiURL}/2`, {
      statusCode: 200,
    }).as("updateRequest");

    cy.wait("@initialLoad");

    cy.contains("button", "Editar").click();

    cy.wait("@findById");

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [
        {
          ...materialToEdit,
          name: "Material Atualizado",
          code: "NEW-02",
          stock: 300,
        },
      ],
    }).as("refreshList");

    cy.get('input[id="code"]').should("be.visible").clear().type("NEW-02");
    cy.get('input[id="name"]')
      .should("be.visible")
      .clear()
      .type("Material Atualizado");
    cy.get('input[id="stock"]').should("be.visible").clear().type("300");

    cy.get('button[type="submit"]').click();

    cy.wait("@updateRequest");
    cy.wait("@refreshList");

    cy.contains("Material Atualizado").should("be.visible");
  });

  it("deve abrir o modal de deleção e remover o item da lista", () => {
    const materialToDelete = {
      id: 2,
      code: "NEW-01",
      name: "Material Novo",
      stock: 250,
    };

    cy.intercept("GET", apiURL, { statusCode: 200, body: [materialToDelete] });
    cy.intercept("DELETE", `${apiURL}/2`, { statusCode: 200 }).as(
      "deleteRequest",
    );

    cy.contains("button", "Excluir").click();

    cy.contains("button", "Confirmar Exclusão").click();

    cy.wait("@deleteRequest");

    cy.contains("Material Novo").should("not.exist");
  });
});
