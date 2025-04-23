import OpenAI from "openai";
import { type Assessment, type InsertInsight } from "@shared/schema";

// Use environment variable for API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy-api-key" });

// Map score ranges to maturity levels
function getMaturityLevel(score: number): string {
  if (score < 30) return "Initial";
  if (score < 50) return "Developing";
  if (score < 70) return "Defined";
  if (score < 85) return "Advanced";
  return "Optimized";
}

// Generate insights for an assessment
export async function generateInsights(assessment: Assessment): Promise<Omit<InsertInsight, "assessmentId">> {
  // If OPENAI_API_KEY is not set, return mock insights
  if (!process.env.OPENAI_API_KEY) {
    return getMockInsights(assessment);
  }
  
  try {
    // Format assessment data for prompt
    const categoryScoresText = Object.entries(assessment.categoryScores)
      .map(([category, score]) => `${category}: ${score}/100 (${getMaturityLevel(score)})`)
      .join("\n");
    
    // Create a prompt for OpenAI
    const prompt = `
      You are an expert business consultant specializing in digital maturity assessments.
      
      Based on the following assessment scores for a company, please provide:
      1. Three key strengths
      2. Four key challenges
      3. Five strategic recommendations (with one marked as high priority)
      
      Overall Maturity Score: ${assessment.overallScore}/100 (${getMaturityLevel(assessment.overallScore)})
      
      Category Scores:
      ${categoryScoresText}
      
      Please respond in JSON format with the following structure:
      {
        "strengths": ["strength1", "strength2", "strength3"],
        "challenges": ["challenge1", "challenge2", "challenge3", "challenge4"],
        "recommendations": [
          {"title": "High Priority Recommendation", "description": "Detailed explanation", "priority": true},
          {"title": "Regular Recommendation", "description": "Detailed explanation", "priority": false},
          ...more recommendations
        ]
      }
    `;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("OpenAI returned empty content");
    }

    const insights = JSON.parse(content);
    
    return {
      strengths: insights.strengths,
      challenges: insights.challenges,
      recommendations: insights.recommendations
    };
    
  } catch (error) {
    console.error("Error generating insights with OpenAI:", error);
    return getMockInsights(assessment);
  }
}

// Fallback function to get mock insights
function getMockInsights(assessment: Assessment): Omit<InsertInsight, "assessmentId"> {
  const overallLevel = getMaturityLevel(assessment.overallScore);
  
  // Find the lowest scoring category
  const sortedCategories = Object.entries(assessment.categoryScores)
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB);
    
  const lowestCategory = sortedCategories[0][0];
  const lowestScore = sortedCategories[0][1];
  
  // Find the highest scoring category
  const highestCategory = sortedCategories[sortedCategories.length - 1][0];
  
  return {
    strengths: [
      `Leadership commitment to digital transformation is evident with strong scores in strategic direction`,
      `Digital talent acquisition shows promising results, especially in core technical roles`,
      `Data collection practices are above industry average, providing a foundation for more advanced analytics`
    ],
    challenges: [
      `${lowestCategory} is significantly underdeveloped with a score of ${lowestScore}/100`,
      `Data governance frameworks are underdeveloped, limiting the organization's ability to leverage data assets`,
      `Digital customer experience lags behind competitors, with inconsistent omnichannel integration`,
      `Innovation processes are ad-hoc rather than systematic, reducing effectiveness of new initiatives`
    ],
    recommendations: [
      {
        title: `Prioritize ${lowestCategory} Improvement`,
        description: `This is your organization's weakest area with a score of ${lowestScore}/100. Develop a comprehensive improvement roadmap with clear milestones.`,
        priority: true
      },
      {
        title: "Establish Formal Data Governance",
        description: "Create a cross-functional data governance committee with executive sponsorship. Implement data quality metrics and assign clear data ownership across the organization.",
        priority: false
      },
      {
        title: "Enhance Digital Customer Experience",
        description: "Conduct a customer journey mapping exercise to identify pain points and opportunities. Prioritize investments in omnichannel integration and personalization capabilities.",
        priority: false
      },
      {
        title: "Formalize Innovation Management",
        description: "Implement a structured innovation process with dedicated resources and executive support. Consider establishing an innovation lab to explore emerging technologies and business models.",
        priority: false
      },
      {
        title: "Develop a Digital Talent Strategy",
        description: "Create comprehensive upskilling programs focusing on data science, AI, and cloud technologies. Consider flexible workforce models to access specialized skills when needed.",
        priority: false
      }
    ]
  };
}
