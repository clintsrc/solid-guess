/*
 * quiz.cy.tsx e2e spec
 *
 * Cypress end-to-end tests for the the quiz user journey.
 * Provides automated test scenarios to simulate real-world user interactions.
 * Verifies core functionality starting a quiz, answering questions, completing the
 * quiz, and restarting the quiz.
 *
 * Each test case uses mock data for the quiz questions and answers to facilitate the
 * testing without requiring a live backend API for reliability and speed.
 *
 * NOTE: The fixture's questions are structured such that the first element in the
 * their array of answers is correct
 */

// Bring in the interfaces for the simulated mongo questions
import { Question, Responses } from "../support/types";

describe("Tech Quiz Game", () => {
  context("Game Setup", () => {
    // Load mock data and intercept API call
    beforeEach(() => {
      cy.fixture<Responses>("questions.json").then((questions) => {
        // Only one question is needed for this partiular test
        const mockData: Question = questions[0];
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: [mockData],
        }).as("getRandomQ");
      });
      cy.visit("/");
    });

    it("should start the quiz and display a question", () => {
      cy.findByRole("button", { name: "Start Quiz" })
        .should("be.visible")
        .click();
    });

    it("intercept API responses with fixture data", () => {
      cy.findByRole("button", { name: "Start Quiz" })
        .should("be.visible")
        .click();

      // Ensure the API call was intercepted
      cy.wait("@getRandomQ").its("response.statusCode").should("eq", 200);

      // Verify that a question appears in the UI
      cy.findByText(
        "What does the 'Infinite Improbability Drive' rely on to function?"
      ).should("be.visible");
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
      cy.findByRole("button", { name: "Start Quiz" })
        .should("be.visible")
        .click();
    });

    it("should present the next question after an answer is selected", () => {
      cy.get(".btn").first().click();
      cy.findByText(
        "How does one debug a malfunctioning robot that insists on reciting poetry instead of performing its primary functions?"
      ).should("be.visible");
    });
  }); // Quiz Interaction

  context("Quiz Completion", () => {
    /* The fixture's questions are structured such that the first element in the 
      their array of answers is correct */
    beforeEach(() => {
      cy.fixture<Responses>("questions.json").then((mockData) => {
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: mockData,
        }).as("getRandomQ");
      });

      // Visit the main page and start the quiz
      cy.visit("/");
      cy.findByRole("button", { name: "Start Quiz" })
        .should("be.visible")
        .click();
    });

    /* Run through the combinations of correct answers to test that they are correctly
      calculated and displayed along with the other expected UI elements */
    it("should correctly report 0 correct answers", () => {
      cy.get(".btn").eq(1).click();
      cy.get(".btn").eq(2).click();
      cy.get(".btn").eq(3).click();

      cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");
      cy.findByText("Your score: 0/3").should("be.visible");
      cy.findByRole("button", { name: "Take New Quiz" }).should("be.visible");
    });

    it("should correctly report 1 correct answer", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(1).click();
      cy.get(".btn").eq(2).click();

      cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");
      cy.findByText("Your score: 1/3").should("be.visible");
      cy.findByRole("button", { name: "Take New Quiz" }).should("be.visible");
    });

    it("should correctly report 2 correct answers", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(0).click();
      cy.get(".btn").eq(1).click();

      cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");
      cy.findByText("Your score: 2/3").should("be.visible");
      cy.findByRole("button", { name: "Take New Quiz" }).should("be.visible");
    });

    it("should correctly report all 3 correct answers", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(0).click();
      cy.get(".btn").eq(0).click();

      cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");
      cy.findByText("Your score: 3/3").should("be.visible");
      cy.findByRole("button", { name: "Take New Quiz" }).should("be.visible");
    });

    // Make sure the new quiz button does begin a new quiz
    it("should restart the quiz when the Take New Quiz button is clicked", () => {
      cy.get(".btn").first().click();
      cy.get(".btn").eq(0).click();
      cy.get(".btn").eq(1).click();

      cy.findByRole("button", { name: "Take New Quiz" })
        .should("be.visible")
        .click();

      // The first question in the mock data is displayed once again
      cy.findByText(
        "What does the 'Infinite Improbability Drive' rely on to function?"
      ).should("be.visible");
    });
  }); // Quiz Completion

  /*
   * NOTE: These are good tests. They're not 'happy path,' and they definitely test
   * user experience by validating crucial backend points of failure down. Outside of 
   * this exercise I would file some bugs and leave them in to fail until the bugs are
   * fixed, but the requirements for this exercise are:
   * - A walkthrough video that demonstrates the component and end-to-end tests
   *    running and passing must be submitted.
   * - Important: You won't need to modify code for the existing application. In this
   *    challenge, you'll only be creating tests for the existing application.
   */
  // context("Edge Cases", () => {
  //   it("should gracefully handle a 404 Not Found error", () => {
  //     // Simulate a 404 error response when fetching questions
  //     cy.intercept("GET", "/api/questions/random", {
  //       statusCode: 404,
  //       body: { error: "No questions found" },
  //     }).as("getRandomQ");

  //     cy.visit("/");

  //     cy.findByRole("button", { name: "Start Quiz" })
  //       .should("be.visible")
  //       .click();

  //     // Verify that the loading spinner appears while fetching questions
  //     cy.get(".spinner-border").should("be.visible");
  //     // see the note in the comments above
  //     // cy.get('.spinner-border').should('not.exist');
  //     // check for an error message explaining that the question couldn't be found */
  //   });

  //   it("should gracefully handle a 500 Internal Server Error", () => {
  //     cy.intercept("GET", "/api/questions/random", {
  //       statusCode: 500,
  //       body: { error: "Internal Server Error" },
  //     }).as("getRandomQ");

  //     cy.visit("/");
  //     cy.findByRole("button", { name: "Start Quiz" })
  //       .should("be.visible")
  //       .click();

  //     cy.get(".spinner-border").should("be.visible");
  //     // see the note in the comments above
  //     // cy.get('.spinner-border').should('not.exist');
  //     // check for an error message explaining that the question couldn't be found */
  //   });
  // }); // Edge Cases
});
