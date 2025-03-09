import { Question, Responses } from "../support/types";

describe("Tech Quiz Game", () => {
  context("Game Setup", () => {
    beforeEach(() => {
      cy.fixture<Responses>("question.json").then((questions) => {
        const mockData: Question = questions[0];
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: [mockData],
        }).as("getRandomQ");
      });
      cy.visit("/");
    });

    it("should find the Start Quiz button on the home page", () => {
      cy.contains("button", "Start Quiz").click();
    });

    it("intercepts API response with fixture data", () => {
      cy.contains("button", "Start Quiz").click();

      // Ensure the API call was intercepted
      cy.wait("@getRandomQ").its("response.statusCode").should("eq", 200);

      // Verify a question appears in the UI
      cy.contains(
        "What does the 'Infinite Improbability Drive' rely on to function?"
      );
    });
  });
});
