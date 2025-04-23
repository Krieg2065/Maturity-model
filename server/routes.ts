import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertAssessmentSchema, insertInsightSchema } from "@shared/schema";
import { generateInsights } from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Get all questions with options
  app.get("/api/questions", async (req, res) => {
    const questions = await storage.getQuestions();
    res.json(questions);
  });

  // Get a specific question with options
  app.get("/api/questions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }
    
    const question = await storage.getQuestion(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    res.json(question);
  });

  // Get all assessments for a user
  app.get("/api/assessments", async (req, res) => {
    // For simplicity, we'll use user ID 1 (demo user)
    const userId = 1;
    const assessments = await storage.getAssessments(userId);
    res.json(assessments);
  });

  // Get a specific assessment
  app.get("/api/assessments/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid assessment ID" });
    }
    
    const assessment = await storage.getAssessment(id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    res.json(assessment);
  });

  // Create a new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      // For simplicity, we'll use user ID 1 (demo user)
      const userId = 1;
      
      // Validate the request body
      const validatedData = insertAssessmentSchema.parse({
        ...req.body,
        userId
      });
      
      // Create the assessment
      const assessment = await storage.createAssessment(validatedData);
      
      // Generate AI insights for the assessment
      const insights = await generateInsights(assessment);
      
      // Store the insights
      const storedInsights = await storage.createInsight({
        assessmentId: assessment.id,
        ...insights
      });
      
      res.status(201).json({ 
        assessment,
        insights: storedInsights
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid assessment data", 
          errors: error.errors 
        });
      }
      
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  // Get insights for an assessment
  app.get("/api/assessments/:id/insights", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid assessment ID" });
    }
    
    const assessment = await storage.getAssessment(id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    
    const insights = await storage.getInsight(id);
    if (!insights) {
      return res.status(404).json({ message: "Insights not found" });
    }
    
    res.json(insights);
  });

  return httpServer;
}
