describe("Login to dashboard", () => {
  it("should not be able to naviagte to the various pages", () => {
    cy.visit("/addPDF");
    cy.get("a[href='/addPDF']").click();
  });
});
