// cypress/support/types.ts
import { Schema } from "mongoose";

interface Answer {
  text: string; // typically a string for answer text, unless you really intend to use ObjectId
  isCorrect: boolean;
}

interface Question {
  _id: string;
  question: string;
  answers: Answer[];
}

// Redefine Responses to be an array of Question objects
export type Responses = Question[];

export type { Question };
