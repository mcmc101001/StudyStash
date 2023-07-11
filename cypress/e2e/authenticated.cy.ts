import { Cookie } from "next-auth/core/lib/cookie";

describe("Login to dashboard", () => {
  beforeEach(() => {
    cy.viewport("macbook-11");
    cy.log("Logging out.");
    cy.visit("/api/auth/signout");
    cy.get("form").submit();
    cy.log("Visiting http://localhost:3000/database");
    cy.visit("/database");
    const username = Cypress.env("GOOGLE_USER");
    const password = Cypress.env("GOOGLE_PW");
    const loginUrl = Cypress.env("SITE_NAME");
    const cookieName = Cypress.env("COOKIE_NAME");
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: false,
      logs: false,
      isPopup: true,
      loginSelector: "#loginButton",
      postLoginSelector: "#logoutButton",
    };

    return cy
      .task<{
        cookies: any;
        lsd: any;
        ssd: any;
      }>("GoogleSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies();

        const cookie = cookies
          .filter((cookie: Cookie) => cookie.name === cookieName)
          .pop();
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });
        }
      });
  });

  it("should be able to upload and delete PDFs", () => {
    cy.visit("/addPDF");
    cy.get("a[href='/addPDF/past_papers']").click();
    cy.fixture("samplePDF.pdf").as("samplePDF");
    cy.get("[aria-label='PDF drop area']").selectFile("@samplePDF", {
      action: "drag-drop",
    });

    // Upload incomplete, clear and reattach file
    cy.get("button").contains("Upload").click();
    cy.contains("Please fill in all fields!").should("exist");
    cy.get("button").contains("Clear PDF").click();
    cy.get("input[type='file']").should("have.value", "");
    cy.get("[aria-label='PDF drop area']").selectFile("@samplePDF", {
      action: "drag-drop",
    });

    // Fill in form and upload
    cy.get("[aria-labelledby='Select Acad Year']").click();
    cy.get(".Year__menu").find(".Year__option").contains("2021-2022").click();
    cy.get("[aria-labelledby='Select Semester']").click();
    cy.get(".Semester__menu")
      .find(".Semester__option")
      .contains("Semester 2")
      .click();
    cy.get("[aria-labelledby='Select Module Code']").click().type("CP");
    cy.get(".Code__menu").find(".Code__option").contains("CP2106").click();
    cy.get("[aria-labelledby='Select Exam Type']").click();
    cy.get(".Type__menu").find(".Type__option").contains("Other").click();
    cy.get("[aria-labelledby='Select Included/Excluded']").click();
    cy.get(".Solutions__menu")
      .find(".Solutions__option")
      .contains("Included in same file")
      .click();
    cy.get("button").contains("Upload").click();
    cy.contains("PDF uploaded successfully!").should("exist");

    // Check on profile page and delete
    cy.visit("/profile");
    cy.get("[aria-label='past_papers']").click();
    cy.contains("samplePDF").should("exist");
    cy.get("[aria-label='Delete resource']").click();
    cy.contains("Are you sure you want to delete this?").should("exist");
    cy.contains("button", "Delete").click();
    cy.contains("samplePDF").should("not.exist");
  });

  it("should be able to edit profile", () => {
    cy.visit("/profile");
    cy.get("h1").should("contain", "StudyStash");
    cy.get("div[type='button']")
      .contains("Edit Profile")
      .should("exist")
      .click();
    cy.get("div[role='dialog']").should("exist");
    cy.get("#name", { timeout: 10000 })
      .click()
      .type("{selectall}{backspace}Test");
    cy.get("#bio")
      .click()
      .type("{selectall}{backspace}Please work, I am begging you!");
    cy.get("[aria-label='Edit Profile']").click();
    cy.contains("Test").should("exist");
    cy.contains("Please work, I am begging you!").should("exist");

    // Switch back
    cy.get("div[type='button']").contains("Edit Profile").click();
    cy.get("div[role='dialog']").should("exist");
    cy.get("#name", { timeout: 10000 })
      .should("exist")
      .click()
      .type("{selectall}{backspace}StudyStash");
    cy.get("#bio").click().type("{selectall}{backspace}Pre cypress test!");
    cy.get("[aria-label='Edit Profile']").click();
    cy.contains("Test").should("not.exist");
    cy.contains("Please work, I am begging you!").should("not.exist");
  });

  it("should be able to status resources and find them on dashboard", () => {
    cy.visit("/database/CP2106/past_papers");

    // Open status component
    cy.get("[data-cy='resourceStatusComponent']")
      .should("exist")
      .trigger("mouseover");
    cy.get("[data-cy='addResourceStatus']").should("exist").click();

    // Set status Saved
    cy.get("[data-cy='resourceStatusSaved']").should("exist").click();

    cy.visit("/dashboard?filterStatus=Saved&filterCategory=past_papers");
    cy.reload();
    cy.get("[data-cy='resourceItem']").should("have.length", 1);

    // Set status to be Todo and assert change in dashboard
    cy.get("[data-cy='resourceStatusComponent']")
      .should("exist")
      .trigger("mouseover");
    cy.get("[data-cy='resourceStatusSaved']").should("exist").click();
    cy.get("[data-cy='resourceStatusTodo']").should("exist").click();
    cy.reload();
    cy.get("[data-cy='resourceItem']").should("have.length", 0);
    cy.visit("/dashboard?filterStatus=Todo&filterCategory=past_papers");
    cy.reload();
    cy.get("[data-cy='resourceItem']").should("have.length", 1);

    // Remove status
    cy.get("[data-cy='resourceStatusComponent']")
      .should("exist")
      .trigger("mouseover");
    cy.get("[data-cy='resourceStatusTodo']").should("exist").click();
    cy.get("[data-cy='resourceStatusTodo']").should("exist").click();
    cy.reload();
    cy.get("[data-cy='resourceItem']").should("have.length", 0);
  });

  it("should be able to rate resources", () => {
    cy.visit("/database/CP2106/past_papers");

    // Check intiial rating
    cy.get("[data-cy='resourceRating']").should("exist").contains("0");

    // Check upvote downvote
    cy.get("[data-cy='upvote']").should("exist").click();
    cy.get("[data-cy='resourceRating']").should("exist").contains("1");
    cy.get("[data-cy='downvote']").should("exist").click();
    cy.get("[data-cy='resourceRating']").should("exist").contains("-1");
    cy.get("[data-cy='downvote']").should("exist").click();
    cy.get("[data-cy='resourceRating']").should("exist").contains("0");
  });

  it("should be able to bookmark modules", () => {
    cy.visit("/dashboard");
    cy.get("h1").should("contain", "Bookmarked Modules");

    // Add module
    cy.get("[aria-label='Add bookmarked module']").should("exist").click();
    cy.wait(1000);
    cy.get("[aria-labelledby='Search module code']").should("exist").type("CP");
    cy.get(".Code__menu").find(".Code__option").contains("CP2106").click();
    cy.contains("a", "CP2106").should("exist").click();

    // Navigate and unstar
    cy.get("[aria-label='Bookmark module']").click();
    cy.visit("/dashboard");
    cy.contains("CP2106").should("not.exist");

    // Navigate to database page and star
    cy.get("a[href='/database']").click();
    cy.get("input").type("CP");
    cy.contains("CP2106").click();
    cy.get("[aria-label='Bookmark module']").click();

    // Navigate to dashboard and unstar
    cy.visit("/dashboard");
    cy.contains("CP2106").should("exist");
    cy.get("[aria-label='Delete CP2106']").click();
    cy.contains("CP2106").should("not.exist");
  });

  it("should be able to report resources", () => {
    cy.visit("/database/CP2106/past_papers");

    // Reporting resource
    cy.get("[data-cy='resourceItem']").should("exist").rightclick();
    cy.get("[data-cy='report-resource']").should("exist").click();
    cy.get("[data-cy='incorrectSemester']").should("exist").click();
    cy.contains("Reported successfully!").should("exist");

    // Checking report on admin page
    cy.visit("/admin?section=resource");
    cy.contains("cypress data seed").should("exist");
    cy.get("button").last().contains("Resolve").click();
    cy.contains("Reported for incorrect semester").should("exist");
    cy.get("button").contains("Ignore & resolve").click();
    cy.wait(1000);
    cy.contains("cypress data seed").should("not.exist");
  });

  it("should be able to report solutions", () => {
    cy.visit("/resource/cljnx5gdn00016udckf1q0kf6/past_papers/solutions");

    // Reporting solution
    cy.get("[data-cy='solutionItem']").should("exist").rightclick();
    cy.get("[data-cy='report-resource']").should("exist").click();
    cy.get("[data-cy='incorrectQuestionPaper']").should("exist").click();
    cy.contains("Reported successfully!").should("exist");

    // Checking report on admin page
    cy.visit("/admin?section=solution");
    cy.contains("cypress data seed").should("exist");
    cy.get("button").last().contains("Resolve").click();
    cy.contains("Reported for incorrect question paper").should("exist");
    cy.get("button").contains("Ignore & resolve").click();
    cy.wait(1000);
    cy.contains("cypress data seed").should("not.exist");
  });

  it("should be able to report comments", () => {
    cy.visit("/database/CP2106/past_papers");

    // Reporting comment
    cy.get("[data-cy='resourceItem']").should("exist").click();
    cy.wait(2000);
    cy.get("button").contains("View comments").should("exist").click();
    cy.get("[data-cy='reportCommentIcon']").should("exist").click();
    cy.get("[data-cy='harassment']").should("exist").click();
    cy.contains("Reported successfully!").should("exist");

    // Checking report on admin page
    cy.visit("/admin?section=comment");
    cy.get("button").last().contains("Resolve").click();
    cy.contains("Reported for harassment").should("exist");
    cy.contains("cypress data seed").should("exist");
    cy.get("button").contains("Ignore & resolve").click();
    cy.wait(2000);
    cy.contains("StudyStash").should("not.exist");
  });

  it("should be able to post, edit and delete comments", () => {
    cy.visit("/database/CP2106/notes");

    // Posting comment
    cy.get("[data-cy='resourceItem']").first().should("exist").click();
    cy.wait(2000);
    cy.get("button").contains("View comments").should("exist").click();
    cy.wait(500);
    cy.get("textarea").type("Test_comment_1");
    cy.get("button").contains("Comment").click();
    cy.wait(2000);
    cy.get("p").contains("Test_comment_1").should("exist");

    // Editing comment
    cy.get("[class='lucide lucide-edit']").first().should("exist").click();
    cy.get("textarea")
      .contains("Test_comment_1")
      .type("{selectall}{backspace}Test_comment_2");
    cy.get("button").contains("Confirm").click({ force: true });
    cy.wait(2000);
    cy.get("p").contains("Test_comment_2").should("exist");

    // Deleting comment
    cy.get("[class='lucide lucide-trash2']").should("exist").click();
    cy.contains("Are you absolutely sure?").should("exist");
    cy.get("[data-cy='deleteCommentButtons']")
      .contains("button", "Delete")
      .click();
    cy.contains("Comment deleted successfully!").should("exist");
    cy.get("p").contains("Test_comment_2").should("not.exist");
  });
});
