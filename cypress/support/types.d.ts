/* 
 * types.d.ts
 *
 * Define the interfaces describing the mongo schema for the cypress tests to use
 * 
 */

import { Schema } from "mongoose";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: Schema.Types.ObjectId; // MongoDB uses hex id values
  question: string;
  answers: Answer[];
}

// Redefine Responses as an array of Question objects
export type Responses = Question[];

export type { Question };
