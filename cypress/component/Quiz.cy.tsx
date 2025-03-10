import Quiz from "../../client/src/components/Quiz";
import { mount } from "cypress/react";
import "@testing-library/cypress/add-commands";

describe("<Quiz />", () => {
  /* Mock a single question to focus the testing on the component's UI items
    and responsiveness */
  const mockQuestion = [
    {
      id: 1,
      question:
        "What does the Pan Galactic Gargle Blaster do to your brain when you drink one?",
      answers: [
        { text: "It makes your brain explode", isCorrect: false },
        { text: "It makes your brain levitate", isCorrect: false },
        { text: "It makes your brain sparkle", isCorrect: true },
        { text: "It makes your brain turn into a frog", isCorrect: false },
      ],
    },
  ];

  beforeEach(() => {
    // Mock the API call to return mockQuestion
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: mockQuestion,
    }).as("getRandomQ");
  });

  it("should initially show the start quiz button", () => {
    mount(<Quiz />); // Mount the React component
    cy.contains("button", "Start Quiz").should("be.visible");
  });

  it("should start the quiz and display a question and answer choices", () => {
    mount(<Quiz />); // Mount the React component

    cy.contains("button", "Start Quiz").click();

    // Use the intercept alias to wait for the question to load
    cy.wait("@getRandomQ");

    // Verify that the question appears correctly
    cy.contains(
      ".card h2",
      "What does the Pan Galactic Gargle Blaster do to your brain when you drink one?"
    ).should("be.visible");

    // Expect 4 answer buttons
    cy.get(".btn.btn-primary").should("have.length", 4);

    // Verify that the component renders the correct answer choices
    cy.contains(".alert.alert-secondary", "It makes your brain explode");
    cy.contains(".alert.alert-secondary", "It makes your brain levitate");
    cy.contains(".alert.alert-secondary", "It makes your brain sparkle");
    cy.contains(
      ".alert.alert-secondary",
      "It makes your brain turn into a frog"
    );
  });

  it("should show quiz completed, and score 0/1 for an incorrect answer", () => {
    mount(<Quiz />); // Mount the React component

    // Click the start button
    cy.contains("button", "Start Quiz").click();

    // Use the intercept alias to wait for the question to load
    cy.wait("@getRandomQ");

    // Question card is visible
    cy.get(".card").should("be.visible");

    // Click an incorrect answer
    cy.contains(".d-flex", "It makes your brain explode")
      .find(".btn.btn-primary")
      .click();

    // Check for "Quiz Completed"
    cy.contains(".card h2", "Quiz Completed").should("be.visible");

    // Check for a 0 of 1 score
    cy.contains(".alert.alert-success", "Your score: 0/1").should("be.visible");

    // Verify "Take New Quiz" button is visible
    cy.contains("button", "Take New Quiz").should("be.visible");
  });

  it("should show quiz completed, and score 1/1 for a correct answer", () => {
    mount(<Quiz />); // Mount the React component

    // Click the start button
    cy.contains("button", "Start Quiz").click();

    // Use the intercept alias to wait for the question to load
    cy.wait("@getRandomQ");

    // Click the correct answer
    cy.contains(".d-flex", "It makes your brain sparkle")
    .find(".btn.btn-primary")
    .click();

    // After answering, check that "Quiz Completed" is displayed
    cy.contains(".card h2", "Quiz Completed").should("be.visible");

    // Check for a 1 of 1 score
    cy.contains(".alert.alert-success", "Your score: 1/1").should("be.visible");

    // Verify "Take New Quiz" button is visible
    cy.contains("button", "Take New Quiz").should("be.visible");
  });
});
