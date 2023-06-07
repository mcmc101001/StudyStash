describe("Filter and sort database", () => {
  it("should have working sorts and filters", () => {
    cy.visit("/");
    // Navigate to database page
    cy.get("a[href='/database']").click();
    cy.get("input").type("CP");
    cy.contains("CP2106").click();
    cy.get("h1").should("contain", "CP2106");
    cy.get("h2").should(
      "contain",
      "Independent Software Development Project (Orbital)"
    );

    // assert various sorts and filters
    cy.get("[data-cy='resourceItem']").should("have.length", 3);
    // acadyear
    cy.get("[aria-labelledby='Acad Year']").click();
    cy.get(".Year__menu").find(".Year__option").contains("2021-2022").click();
    cy.get("[data-cy='resourceItem']").should("have.length", 0);
    cy.get("[aria-labelledby='Acad Year']")
      .click()
      .type("{selectall}{backspace}{esc}");
    // semester
    cy.get("[aria-labelledby='Semester']").click();
    cy.get(".Semester__menu")
      .find(".Semester__option")
      .contains("Semester 2")
      .click();
    cy.get("[data-cy='resourceItem']").should("have.length", 2);
    cy.get("[aria-labelledby='Semester']")
      .click()
      .type("{selectall}{backspace}{esc}");
    // exam type
    cy.get("[aria-labelledby='Exam Type']").click();
    cy.get(".Type__menu").find(".Type__option").contains("Other").click();
    cy.get("[data-cy='resourceItem']").should("have.length", 1);
    cy.get("[aria-labelledby='Exam Type']")
      .click()
      .type("{selectall}{backspace}{esc}");
    // sort
    cy.get("[aria-labelledby='Sort']").click();
    cy.get(".Sort__menu").find(".Sort__option").contains("Most recent").click();
    cy.get("[data-cy='resourceItem']").should("have.length", 1);
    cy.get("[aria-labelledby='Sort']")
      .click()
      .type("{selectall}{backspace}{esc}");

    // retain sorts on navigation
  });
});
