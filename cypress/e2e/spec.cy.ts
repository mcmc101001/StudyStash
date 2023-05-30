describe("Google", () => {
  beforeEach(function () {
    cy.loginByGoogleApi();
  });

  it("shows onboarding", function () {
    cy.visit("/");
    cy.contains("Hello world").should("be.visible");
  });
});
