import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model (kept from original schema)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Assessment questions
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  questionText: text("question_text").notNull(),
  category: text("category").notNull(),
  order: integer("order").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  questionText: true,
  category: true,
  order: true,
});

// Question options
export const options = pgTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull(),
  optionText: text("option_text").notNull(),
  description: text("description"),
  value: integer("value").notNull(),
  order: integer("order").notNull(),
});

export const insertOptionSchema = createInsertSchema(options).pick({
  questionId: true,
  optionText: true,
  description: true,
  value: true,
  order: true,
});

// Assessment results
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  overallScore: integer("overall_score").notNull(),
  categoryScores: json("category_scores").notNull().$type<Record<string, number>>(),
  answers: json("answers").notNull().$type<Record<string, { questionId: number, optionId: number, value: number }>>(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  userId: true,
  overallScore: true,
  categoryScores: true,
  answers: true,
});

// AI-generated insights
export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  strengths: json("strengths").notNull().$type<string[]>(),
  challenges: json("challenges").notNull().$type<string[]>(),
  recommendations: json("recommendations").notNull().$type<Array<{ title: string, description: string, priority: boolean }>>(),
});

export const insertInsightSchema = createInsertSchema(insights).pick({
  assessmentId: true,
  strengths: true,
  challenges: true,
  recommendations: true,
});

// Define type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

export type InsertOption = z.infer<typeof insertOptionSchema>;
export type Option = typeof options.$inferSelect;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export type InsertInsight = z.infer<typeof insertInsightSchema>;
export type Insight = typeof insights.$inferSelect;

// Define the question structure for the assessment
export interface QuestionWithOptions extends Question {
  options: Option[];
}
