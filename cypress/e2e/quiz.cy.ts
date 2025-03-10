import { Question, Responses } from "../support/types";

describe("Tech Quiz Game", () => {
  context("Game Setup", () => {
    beforeEach(() => {
      cy.fixture<Responses>("questions.json").then((questions) => {
        const mockData: Question = questions[0];
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: [mockData],
        }).as("getRandomQ");
      });
      cy.visit("/");
    });

    it("should start the quiz and display a question", () => {
      cy.contains("button", "Start Quiz").should("be.visible").click();
    });

    it("intercept API responses with fixture data", () => {
      cy.contains("button", "Start Quiz").should("be.visible").click();

      // Ensure the API call was intercepted
      cy.wait("@getRandomQ").its("response.statusCode").should("eq", 200);

      // Verify a question appears in the UI
      cy.contains(
        "What does the 'Infinite Improbability Drive' rely on to function?"
      );
    });
  }); // Game Setup

  context("Quiz Interaction", () => {
    beforeEach(() => {
      cy.fixture<Responses>("questions.json").then((mockData) => {
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: mockData,
        }).as("getRandomQ");
      });
      cy.visit("/");
      cy.contains("button", "Start Quiz").should("be.visible").click();
    });

    it("should present the next question after an answer is selected", () => {
      cy.get(".btn").first().click();
      cy.contains(
        "How does one debug a malfunctioning robot that insists on reciting poetry instead of performing its primary functions?"
      ).should("be.visible");
    });
  }); // Quiz Interaction

  context("Quiz Completion", () => {
    /* The fixture's questions are structured such that the first element in the 
      their array of answers is correct */
    beforeEach(() => {
      // Load mock data and intercept API call
      cy.fixture<Responses>("questions.json").then((mockData) => {
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: mockData,
        }).as("getRandomQ");
      });

      // Visit the main page and start the quiz
      cy.visit("/");
      cy.contains("button", "Start Quiz").should("be.visible").click();
    });

    it("should correctly report 0 correct answers", () => {
      cy.get(".btn").eq(1).click();
      cy.get(".btn").eq(2).click();
      cy.get(".btn").eq(3).click();

      cy.contains("Quiz Completed").should("be.visible");
      cy.contains("Your score: 0/3").should("be.visible");
      cy.contains("Take New Quiz").should("be.visible");
    });

    it("should correctly report 1 correct answer", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(1).click();
      cy.get(".btn").eq(2).click();

      cy.contains("Quiz Completed").should("be.visible");
      cy.contains("Your score: 1/3").should("be.visible");
      cy.contains("Take New Quiz").should("be.visible");
    });

    it("should correctly report 2 correct answers", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(0).click();
      cy.get(".btn").eq(1).click();

      cy.contains("Quiz Completed").should("be.visible");
      cy.contains("Your score: 2/3").should("be.visible");
      cy.contains("Take New Quiz").should("be.visible");
    });

    it("should correctly report all 3 correct answers", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(0).click();
      cy.get(".btn").eq(0).click();

      cy.contains("Quiz Completed").should("be.visible");
      cy.contains("Your score: 3/3").should("be.visible");
      cy.contains("Take New Quiz").should("be.visible");
    });

    it("should restart the quiz when the Take New Quiz button is clicked", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(0).click();
      cy.get(".btn").eq(1).click();

      cy.contains("Take New Quiz").should("be.visible").click();

      // The first question in the mock data is displayed once again
      cy.contains(
        "What does the 'Infinite Improbability Drive' rely on to function?"
      ).should("be.visible");
    });
  }); // Quiz Completion

  /*
   * NOTE: This is a good test. It's not 'happy path,' and it's definitely testing
   * user experience by validating a crucial point of failure when the backend is
   * down. Outside of this exercise I would file some bugs and leave them to fail
   * until the app was updated, but the requirements for this exercise are:
   * - A walkthrough video that demonstrates the component and end-to-end tests
   *    running and passing must be submitted.
   * - Important: You won't need to modify code for the existing application. In this
   *    challenge, you'll only be creating tests for the existing application.
   */
  context("Edge Cases", () => {
    it("should gracefully handle a 404 Not Found error", () => {
      // Simulate a 404 error response when fetching questions
      cy.intercept("GET", "/api/questions/random", {
        statusCode: 404,
        body: { error: "No questions found" },
      }).as("getRandomQ");

      cy.visit("/");

      cy.contains("button", "Start Quiz").should("be.visible").click();

      // Verify that the loading spinner appears while fetching questions
      cy.get(".spinner-border").should("be.visible");
      /* see the note in the comments above
       * cy.get('.spinner-border').should('not.exist');
       * check for an error message explaining that the question couldn't be found */
      cy.visit("/"); // for now...
    });

    it("should gracefully handle a 500 Internal Server Error", () => {
      cy.intercept("GET", "/api/questions/random", {
        statusCode: 500,
        body: { error: "Internal Server Error" },
      }).as("getRandomQ");

      cy.visit("/");
      cy.contains("button", "Start Quiz").should("be.visible").click();

      cy.get(".spinner-border").should("be.visible");
      /* see the note in the comments above
       * cy.get('.spinner-border').should('not.exist');
       * check for an error message explaining that the question couldn't be found */
      cy.visit("/"); // for now...
    });
  }); // Edge Cases
});
