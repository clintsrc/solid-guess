//import { mockState } from "../support/utils/helpers";

describe("Tech Quiz Game", () => {
  context("Game Setup", () => {
    beforeEach(() => {
      // // Stub the API request for starting the game
      // cy.intercept("GET", "/api/questions/random", {
      //   statusCode: 200,
      //   body: mockState, // Using the mocked guess data
      // }).as("getRandomQ");
      // Wait for the API call to complete
      //cy.wait("@getRandomQ").its("response.statusCode").should("eq", 200);

      // Visit the home page before each test
      cy.visit("/");
    });

    it("should find the Start Quiz button on the home page", () => {
      cy.getDataTest("start-quiz").click();
    });

    it.only("intercepts API response with fixture data", () => {
      cy.fixture("questions.json").then((mockData) => {
        cy.intercept("GET", "/api/questions/random", {
          statusCode: 200,
          body: mockData,
        }).as("getRandomQ");
      });
    
      cy.getDataTest("start-quiz").click();
    
      // Ensure the API call was intercepted
      cy.wait("@getRandomQ").its("response.statusCode").should("eq", 200);
    
      // Verify a question appears in the UI
      cy.contains("What is the purpose of a GitHub Actions workflow?");
    });
    
  });
});
