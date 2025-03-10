/*
 * Quiz.cy.tsx Component spec
 *
 * Cypress spec for the Quiz component. Tests its rendering and behavior in response to
 * automated user interactions.
 *
 */

// Use the project's Quiz component directly
import Quiz from "../../client/src/components/Quiz";
// The component must be mounted in the Cypress environment for each test
import { mount } from "cypress/react";

describe("<Quiz />", () => {
  /* Mock a single question to focus the testing on the component's UI items
    and responsiveness */
  const mockQuestion = [
    {
      id: 1,
      question:
        "What does the Pan Galactic Gargle Blaster do to your brain when you drink one?",
      answers: [
        { text: "It makes your brain turn into a frog", isCorrect: false },
        { text: "It makes your brain explode", isCorrect: false },
        { text: "It makes your brain levitate", isCorrect: false },
        { text: "It makes your brain sparkle", isCorrect: true },
      ],
    },
  ];

  beforeEach(() => {
    // Mock the API call to return mockQuestion
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: mockQuestion,
    }).as("getRandomQ"); // specify an alias to reference the intercept later
  });

  it("should initially show the Start Quiz button", () => {
    mount(<Quiz />);
    cy.findByRole("button", { name: "Start Quiz" }).should("be.visible");
  });

  it("should start the quiz and display a question and answer choices", () => {
    mount(<Quiz />);

    cy.findByRole("button", { name: "Start Quiz" })
      .should("be.visible")
      .click();

    // Use the intercept alias to wait for the question to load
    cy.wait("@getRandomQ");

    // Verify that the question appears correctly
    cy.findByText(
      "What does the Pan Galactic Gargle Blaster do to your brain when you drink one?"
    ).should("be.visible");

    // Expect 4 answer button choices
    cy.get(".btn.btn-primary").should("have.length", 4);
    // Check the content
    cy.findByText("It makes your brain turn into a frog").should("be.visible");
    cy.findByText("It makes your brain explode").should("be.visible");
    cy.findByText("It makes your brain levitate").should("be.visible");
    cy.findByText("It makes your brain sparkle").should("be.visible");
  });

  it("should show quiz completed, and the score 0/1 for an incorrect answer", () => {
    mount(<Quiz />);

    cy.findByRole("button", { name: "Start Quiz" })
      .should("be.visible")
      .click();

    cy.wait("@getRandomQ");

    // Question card is visible
    cy.get(".card").should("be.visible");

    // Choose a wrong answer
    // Since we're not using data-id's, use contains to find the answer text (div)
    cy.contains(".alert.alert-secondary", "It makes your brain explode")
      .prev() // Get the button element that comes before the div text
      .click(); // Click the button

    // Check for Quiz Completed after choosing the answer
    cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");

    // Check for the score 0 of 1
    cy.findByText("Your score: 0/1").should("be.visible");

    // Verify the Take New Quiz button is available
    cy.findByRole("button", { name: "Take New Quiz" }).should("be.visible");
  });

  it("should show quiz completed, and the score 1/1 for a correct answer", () => {
    mount(<Quiz />);

    cy.findByRole("button", { name: "Start Quiz" })
      .should("be.visible")
      .click();

    cy.wait("@getRandomQ");

    // Click the correct answer
    // Since we're not using data-id's, use contains to find the answer text (div)
    cy.contains(".alert.alert-secondary", "It makes your brain sparkle")
      .prev() // Get the button element that comes before the div text
      .click(); // Click the button

    // Check for Quiz Completed after choosing the answer
    cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");

    // Check for the score 1 of 1
    cy.findByText("Your score: 1/1").should("be.visible");

    // Verify the Take New Quiz button is available
    cy.findByRole("button", { name: "Take New Quiz" }).should("be.visible");
  });

  it("should present a new quiz for the Take New Quiz button", () => {
    mount(<Quiz />);

    cy.findByRole("button", { name: "Start Quiz" })
      .should("be.visible")
      .click();

    cy.wait("@getRandomQ");

    cy.contains(".alert.alert-secondary", "It makes your brain sparkle")
      .prev()
      .click();

    cy.findByText("Quiz Completed").should("have.text", "Quiz Completed");
    // Verify the Take New Quiz button is available
    cy.findByRole("button", { name: "Take New Quiz" })
      .should("be.visible")
      .click(); // Click the Take New Quiz button

    // Verify that the question loads after clicking Take New Quiz
    cy.findByText(
      "What does the Pan Galactic Gargle Blaster do to your brain when you drink one?"
    ).should("be.visible");
  });
});
