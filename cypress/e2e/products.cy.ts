describe("Página de Produtos", () => {
  const apiURL = "**/products";

  beforeEach(() => {
    cy.visit("http://localhost:3000/admin/produtos");
  });

  it("deve exibir Skeletons enquanto carrega e depois mostrar a lista", () => {
    cy.intercept("GET", apiURL, {
      delay: 1000,
      statusCode: 200,
      body: [{ id: 1, code: "P001", name: "Produto Real", price: 100 }],
    }).as("getDelayedProducts");

    cy.get(".animate-pulse").should("have.length.at.least", 5);

    cy.wait("@getDelayedProducts");

    cy.contains("P001").should("be.visible");
    cy.contains("Produto Real").should("be.visible");
  });

  it("deve exibir o estado de erro e permitir tentar novamente", () => {
    cy.intercept("GET", apiURL, { statusCode: 500 }).as("getProductsError");

    cy.wait("@getProductsError");

    cy.contains("Erro de Sincronização").should("be.visible");
    cy.contains("Erro ao carregar dados.").should("be.visible");

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [{ id: 1, code: "P001", name: "Produto Real", price: 100 }],
    }).as("getProductsRetry");

    cy.contains("button", /tentar novamente/i).click();

    cy.wait("@getProductsRetry");
    cy.contains("Produto Real").should("be.visible");
  });

  it("deve abrir o modal de criação e recarregar a lista após criar", () => {
    cy.intercept("GET", apiURL, { statusCode: 200, body: [] }).as(
      "initialLoad",
    );

    cy.intercept("POST", apiURL, { statusCode: 201 }).as("createRequest");

    cy.contains("button", "Criar Produto").click();

    cy.get('input[id="code"]').type("NEW-01");
    cy.get('input[id="name"]').type("Produto Novo");
    cy.get('input[id="price"]').type("250");

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [{ id: 2, code: "NEW-01", name: "Produto Novo", price: 250 }],
    }).as("refreshList");

    cy.get('button[type="submit"]').click();

    cy.wait("@createRequest");
    cy.wait("@refreshList");

    cy.contains("NEW-01").should("be.visible");
  });

  it("deve abrir o modal de atualização e recarregar a lista após atualizar", () => {
    const productToEdit = {
      id: 2,
      code: "NEW-01",
      name: "Produto Antigo",
      price: 250,
    };

    cy.intercept("GET", apiURL, {
      statusCode: 200,
      body: [productToEdit],
    }).as("initialLoad");

    cy.intercept("GET", `${apiURL}/2`, {
      statusCode: 200,
      body: productToEdit,
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
          ...productToEdit,
          name: "Produto Atualizado",
          code: "NEW-02",
          price: 300,
        },
      ],
    }).as("refreshList");

    cy.get('input[id="code"]').should("be.visible").clear().type("NEW-02");
    cy.get('input[id="name"]')
      .should("be.visible")
      .clear()
      .type("Produto Atualizado");
    cy.get('input[id="price"]').should("be.visible").clear().type("300");

    cy.get('button[type="submit"]').click();

    cy.wait("@updateRequest");
    cy.wait("@refreshList");

    cy.contains("Produto Atualizado").should("be.visible");
  });

  it("deve abrir o modal de deleção e remover o item da lista", () => {
    const productToDelete = {
      id: 2,
      code: "NEW-01",
      name: "Produto Novo",
      price: 250,
    };

    cy.intercept("GET", apiURL, { statusCode: 200, body: [productToDelete] });
    cy.intercept("DELETE", `${apiURL}/2`, { statusCode: 200 }).as(
      "deleteRequest",
    );

    cy.contains("button", "Excluir").click();

    cy.contains("button", "Confirmar Exclusão").click();

    cy.wait("@deleteRequest");

    cy.contains("Produto Novo").should("not.exist");
  });
});
