/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import '@testing-library/cypress/add-commands';

/*
 * From the spec:
 * Important: You won't need to modify code for the existing application. In this 
 * challenge, you'll only be creating tests for the existing application.
 * 
 * Cypress indicates that it's best practice to use data attributes
 * (ref: https://docs.cypress.io/app/core-concepts/best-practices)
 * 
 * If the app code had
 *  data-test="start-quiz"
 * You could use this custom command:
 *  cy.getDataTest("start-quiz")
 * 
 */
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       getDataTest(dataTestSelector: string): Chainable<JQuery<HTMLElement>>;
//     }
//   }
// }

// Cypress.Commands.add("getDataTest", (dataTestSelector: string) => {
//   return cy.get(`[data-test="${dataTestSelector}"]`);
// });