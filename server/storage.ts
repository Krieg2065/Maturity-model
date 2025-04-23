import { 
  users, type User, type InsertUser,
  questions, type Question, type InsertQuestion,
  options, type Option, type InsertOption,
  assessments, type Assessment, type InsertAssessment,
  insights, type Insight, type InsertInsight,
  type QuestionWithOptions
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Question methods
  getQuestions(): Promise<QuestionWithOptions[]>;
  getQuestion(id: number): Promise<QuestionWithOptions | undefined>;
  createQuestion(question: InsertQuestion): Promise<Question>;

  // Option methods
  getOptions(questionId: number): Promise<Option[]>;
  createOption(option: InsertOption): Promise<Option>;

  // Assessment methods
  getAssessments(userId: number): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;

  // Insight methods
  getInsight(assessmentId: number): Promise<Insight | undefined>;
  createInsight(insight: InsertInsight): Promise<Insight>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private options: Map<number, Option[]>;
  private assessments: Map<number, Assessment>;
  private insights: Map<number, Insight>;
  
  private currentUserId: number;
  private currentQuestionId: number;
  private currentOptionId: number;
  private currentAssessmentId: number;
  private currentInsightId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.options = new Map();
    this.assessments = new Map();
    this.insights = new Map();
    
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentOptionId = 1;
    this.currentAssessmentId = 1;
    this.currentInsightId = 1;
    
    // Initialize with default questions and options
    this.initializeQuestionsAndOptions();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Question methods
  async getQuestions(): Promise<QuestionWithOptions[]> {
    const questionsWithOptions: QuestionWithOptions[] = [];
    
    for (const question of this.questions.values()) {
      const options = await this.getOptions(question.id);
      questionsWithOptions.push({
        ...question,
        options
      });
    }
    
    // Sort by question order
    return questionsWithOptions.sort((a, b) => a.order - b.order);
  }

  async getQuestion(id: number): Promise<QuestionWithOptions | undefined> {
    const question = this.questions.get(id);
    if (!question) return undefined;
    
    const options = await this.getOptions(id);
    return {
      ...question,
      options
    };
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { ...insertQuestion, id };
    this.questions.set(id, question);
    return question;
  }

  // Option methods
  async getOptions(questionId: number): Promise<Option[]> {
    const options = this.options.get(questionId) || [];
    return [...options].sort((a, b) => a.order - b.order);
  }

  async createOption(insertOption: InsertOption): Promise<Option> {
    const id = this.currentOptionId++;
    const option: Option = { ...insertOption, id };
    
    // Initialize array if it doesn't exist
    if (!this.options.has(option.questionId)) {
      this.options.set(option.questionId, []);
    }
    
    const options = this.options.get(option.questionId)!;
    options.push(option);
    
    return option;
  }

  // Assessment methods
  async getAssessments(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => assessment.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentAssessmentId++;
    const date = new Date();
    const assessment: Assessment = { ...insertAssessment, id, date };
    this.assessments.set(id, assessment);
    return assessment;
  }

  // Insight methods
  async getInsight(assessmentId: number): Promise<Insight | undefined> {
    return Array.from(this.insights.values()).find(
      (insight) => insight.assessmentId === assessmentId
    );
  }

  async createInsight(insertInsight: InsertInsight): Promise<Insight> {
    const id = this.currentInsightId++;
    const insight: Insight = { ...insertInsight, id };
    this.insights.set(id, insight);
    return insight;
  }

  // Initialize default questions and options
  private async initializeQuestionsAndOptions() {
    // Create a default user
    await this.createUser({
      username: "demo",
      password: "password",
      name: "Demo User"
    });

    // Define the 8 main dimensions and their sub-dimensions from the framework
    const dimensionsMap = [
      {
        name: "Strategic Governance & Value Management",
        subdimensions: [
          "Executive Sponsorship & Leadership Buy-in",
          "Business Case Robustness & Value Realization",
          "Steering Committee Effectiveness & Decision Governance",
          "Funding Adequacy & Budget Control",
          "Real-Time KPI Tracking & Executive Dashboards"
        ]
      },
      {
        name: "Program & Project Execution",
        subdimensions: [
          "Risk & Issue Management Excellence",
          "Partner & Vendor Performance Management",
          "Program Management Office Maturity Framework",
          "Project Planning & Phase Structure Execution",
          "Scope Management & Change Control",
          "Predictive Risk Analysis & Early Warning Systems"
        ]
      },
      {
        name: "Technical Architecture & Infrastructure",
        subdimensions: [
          "Performance Monitoring & System Health Checks",
          "Technical Landscape Understanding & Documentation",
          "Cloud Adoption, Scalability & Performance Optimization",
          "Integration Architecture & API Management",
          "ISV & Add-on Solution Governance"
        ]
      },
      {
        name: "Security, Compliance & Data Management",
        subdimensions: [
          "Security, Compliance & Data Privacy Framework",
          "Release & Deployment Management (CI/CD, DevOps)",
          "Data Migration Strategy & Execution",
          "Master Data Management (MDM) & Data Governance",
          "Localization, Tax, & Legal Compliance"
        ]
      },
      {
        name: "Business Process & Solution Design",
        subdimensions: [
          "Customization Strategy & Best Practices",
          "Industry-Specific Requirements & Customization Compliance",
          "Process Documentation & Standardization",
          "Process Automation & Workflow Optimization",
          "AI & Copilot Enablement for Business Process Improvement"
        ]
      },
      {
        name: "Core Module Configuration",
        subdimensions: [
          "Testing & Validation Framework",
          "Finance Module Configuration Maturity",
          "Supply Chain Management (SCM) Configuration Maturity",
          "Manufacturing Execution & Planning Configuration Maturity",
          "Retail & Commerce Configuration Maturity"
        ]
      },
      {
        name: "Change Management & User Adoption",
        subdimensions: [
          "Stakeholder Engagement & Communication Strategy",
          "Resistance Management & Cultural Change Adoption",
          "Training & User Enablement Excellence",
          "User Adoption Measurement & Success Tracking"
        ]
      },
      {
        name: "Support & Continuous Improvement",
        subdimensions: [
          "Hypercare & Transition to Steady-State Support",
          "Support Model & Service Management (ITIL Alignment)",
          "Continuous Improvement & Optimization Programs"
        ]
      }
    ];

    // Create questions - one main question for each dimension and a sample of subdimensions
    let questionOrder = 1;
    const questionData: InsertQuestion[] = [];
    
    // Create main dimension questions and select subdimension questions
    for (const dimension of dimensionsMap) {
      // Add main dimension question
      questionData.push({
        questionText: `How would you rate your organization's overall maturity in ${dimension.name}?`,
        category: dimension.name,
        order: questionOrder++
      });
      
      // Add 1-2 subdimension questions for each main dimension
      // This limits the total number of questions to a reasonable amount
      const selectedSubdimensions = dimension.subdimensions.slice(0, 2);
      
      for (const subdimension of selectedSubdimensions) {
        questionData.push({
          questionText: `How would you assess your organization's maturity in ${subdimension}?`,
          category: dimension.name,
          order: questionOrder++
        });
      }
    }

    // Insert questions and create options
    for (const q of questionData) {
      const question = await this.createQuestion(q);
      
      // Create standardized maturity level options for each question
      const optionsData: InsertOption[] = [
        { 
          questionId: question.id, 
          optionText: "Initial", 
          description: "Ad-hoc processes with minimal standardization, largely reactive approach.", 
          value: 20, 
          order: 1 
        },
        { 
          questionId: question.id, 
          optionText: "Developing", 
          description: "Basic processes defined but not consistently applied, limited integration across functions.", 
          value: 40, 
          order: 2 
        },
        { 
          questionId: question.id, 
          optionText: "Defined", 
          description: "Standardized processes implemented across most areas, with regular reviews and updates.", 
          value: 60, 
          order: 3 
        },
        { 
          questionId: question.id, 
          optionText: "Advanced", 
          description: "Optimized processes with integrated tools, metrics-driven approach and proactive management.", 
          value: 80, 
          order: 4 
        },
        { 
          questionId: question.id, 
          optionText: "Optimized", 
          description: "Leading practice with continuous improvement, automated workflows and predictive capabilities.", 
          value: 100, 
          order: 5 
        }
      ];
      
      // Insert options
      for (const o of optionsData) {
        await this.createOption(o);
      }
    }

    // Create sample category scores for each dimension
    const categoryScores1: Record<string, number> = {};
    const categoryScores2: Record<string, number> = {};
    
    // Generate initial scores for each dimension
    for (const dimension of dimensionsMap) {
      categoryScores1[dimension.name] = 30 + Math.floor(Math.random() * 30); // Scores between 30-60
    }
    
    // Create improved scores for second assessment
    for (const [dimension, score] of Object.entries(categoryScores1)) {
      categoryScores2[dimension] = Math.min(100, score + 5 + Math.floor(Math.random() * 15)); // Improvement of 5-20 points
    }

    // Create sample past assessments
    const pastAssessments: InsertAssessment[] = [
      {
        userId: 1,
        overallScore: Math.floor(Object.values(categoryScores1).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores1).length),
        categoryScores: categoryScores1,
        answers: {} // We'll skip detailed answers for simplicity
      },
      {
        userId: 1,
        overallScore: Math.floor(Object.values(categoryScores2).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores2).length),
        categoryScores: categoryScores2,
        answers: {} // We'll skip detailed answers for simplicity
      }
    ];

    // Set dates for past assessments
    const assessment1 = await this.createAssessment(pastAssessments[0]);
    const assessment2 = await this.createAssessment(pastAssessments[1]);
    
    // Override the dates to make them in the past
    const now = new Date();
    
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(now.getMonth() - 3);
    
    this.assessments.set(assessment1.id, { ...assessment1, date: sixMonthsAgo });
    this.assessments.set(assessment2.id, { ...assessment2, date: threeMonthsAgo });

    // Create insights for the assessments
    const insight1: InsertInsight = {
      assessmentId: assessment1.id,
      strengths: [
        "Executive sponsorship showing improvement in key initiatives",
        "Test validation framework follows industry standards",
        "Basic change management processes are being adopted"
      ],
      challenges: [
        "Technical landscape documentation is limited and outdated",
        "Vendor performance management lacks structured metrics",
        "Data migration strategy has significant gaps",
        "Business process standardization is inconsistent across units"
      ],
      recommendations: [
        {
          title: "Enhance Governance Structure",
          description: "Formalize steering committee with documented decision rights and escalation paths.",
          priority: true
        },
        {
          title: "Develop Technical Landscape Documentation",
          description: "Create comprehensive system documentation including integrations, data flows, and dependencies.",
          priority: true
        },
        {
          title: "Improve Data Migration Strategy",
          description: "Develop detailed approach for data quality assessment, cleansing, and validation during migrations.",
          priority: false
        },
        {
          title: "Standardize Business Processes",
          description: "Document and harmonize core business processes across organizational units.",
          priority: false
        }
      ]
    };

    const insight2: InsertInsight = {
      assessmentId: assessment2.id,
      strengths: [
        "Governance structure with improved steering committee effectiveness",
        "Technical documentation has seen measurable improvement",
        "Data migration approach now includes quality validation steps",
        "Process standardization efforts showing positive results"
      ],
      challenges: [
        "Cloud adoption strategy needs better alignment with business goals",
        "Testing framework lacks automation for regression testing",
        "Change management requires better resistance handling approaches",
        "Release management processes need continuous integration"
      ],
      recommendations: [
        {
          title: "Optimize Cloud Adoption Strategy",
          description: "Develop strategic roadmap that aligns migration priorities with business value and TCO optimization.",
          priority: true
        },
        {
          title: "Implement Automated Testing",
          description: "Establish test automation framework with CI/CD pipeline integration for core business processes.",
          priority: true
        },
        {
          title: "Enhance Change Management",
          description: "Develop structured resistance management approach with stakeholder analysis and targeted interventions.",
          priority: false
        },
        {
          title: "Establish CI/CD Pipeline",
          description: "Implement continuous integration and deployment processes with automated quality gates.",
          priority: false
        }
      ]
    };

    await this.createInsight(insight1);
    await this.createInsight(insight2);
  }
}

export const storage = new MemStorage();
