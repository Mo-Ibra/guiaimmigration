import dotenv from 'dotenv';
dotenv.config();
import { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import * as pako from "pako";

import { z } from "zod";
import { Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertTestimonialSchema, insertTranslationOrderSchema, insertTranslationPricingSchema, insertUserSchema } from "@shared/schema";
import Stripe from "stripe";
import { AuthenticatedRequest } from "./types";
// Dynamic import for nodemailer to avoid ES module issues

// Validate Stripe configuration
if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key_here') {
  console.warn('⚠️  Stripe secret key not configured. Payment features will be disabled.');
  console.warn('   Please set STRIPE_SECRET_KEY in your .env file with a valid Stripe secret key.');
}

const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key_here'
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Initialize email transporter
let emailTransporter: any = null;

async function initializeEmailTransporter() {
  console.log('🔧 Configuring email transporter...');
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'configured' : 'missing');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'configured' : 'missing');

  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('✅ Email transporter configured successfully');
    } else {
      console.log('❌ Email credentials missing');
    }
  } catch (error) {
    console.log('❌ Email transporter configuration failed:', error);
  }
}

// Initialize email transporter
initializeEmailTransporter();

// Email sending function
async function sendDownloadEmail(customerEmail: string, downloadUrl: string, guideName: string) {
  console.log(`📧 Attempting to send email to: ${customerEmail}`);
  console.log(`📧 Guide name: ${guideName}`);
  console.log(`📧 Download URL: ${downloadUrl}`);

  if (!emailTransporter) {
    console.log('❌ Email transporter not initialized');
    return;
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('❌ Email credentials not configured');
    return;
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: customerEmail,
      subject: `Your Immigration Guide: ${guideName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for your purchase!</h2>
          <p>Your immigration guide "<strong>${guideName}</strong>" is ready for download.</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Download your guide:</strong></p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5000'}${downloadUrl}"
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Download Immigration Guide
            </a>
          </div>

          <p><strong>Important:</strong> This download link expires in 24 hours for security reasons.</p>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 14px;">
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you for choosing our immigration services!</p>
          </div>
        </div>
      `
    };

    const result = await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Download email sent successfully to ${customerEmail}`);
    console.log(`📧 Message ID: ${result.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send download email:', error);
  }
}

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads', 'translations');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `translation-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 110 * 1024 * 1024, // 110MB limit for regular uploads (with overhead)
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // Allow specific file types for translation
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.'));
    }
  }
});

// Enhanced upload configuration for large files
const largeFileUploadDir = path.join(process.cwd(), 'uploads', 'large-files');
const chunksDir = path.join(process.cwd(), 'uploads', 'chunks');

// Ensure upload directories exist
[largeFileUploadDir, chunksDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer configuration for chunked uploads
const chunkUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, chunksDir);
    },
    filename: (req: any, file: any, cb: any) => {
      const { uploadId, chunkIndex } = req.body;
      cb(null, `${uploadId}-chunk-${chunkIndex}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per chunk
  }
});

// Large file upload configuration (for non-chunked large files)
const largeFileUpload = multer({
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, largeFileUploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, `large-file-${uniqueSuffix}${extension}`);
    }
  }),
  limits: {
    fileSize: 110 * 1024 * 1024, // 110MB limit for large files (with overhead for 100MB files)
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.'));
    }
  }
});

// In-memory storage for tracking upload sessions
interface UploadSession {
  uploadId: string;
  fileName: string;
  fileSize: number;
  totalChunks: number;
  receivedChunks: Set<number>;
  fileType: string;
  compressed: boolean;
  createdAt: Date;
}

const uploadSessions = new Map<string, UploadSession>();

// Utility functions for file compression
const compressFile = (buffer: Buffer): Buffer => {
  try {
    const compressed = pako.gzip(buffer);
    return Buffer.from(compressed);
  } catch (error) {
    console.error('Compression failed:', error);
    return buffer; // Return original if compression fails
  }
};

const decompressFile = (buffer: Buffer): Buffer => {
  try {
    // Check if the buffer actually contains gzip data by checking the magic number
    if (buffer.length < 2 || buffer[0] !== 0x1f || buffer[1] !== 0x8b) {
      console.log('File is not gzip compressed, returning original buffer');
      return buffer;
    }
    
    const decompressed = pako.ungzip(buffer);
    // Convert Uint8Array to Buffer
    console.log('File successfully decompressed');
    return Buffer.from(Array.from(decompressed));
  } catch (error) {
    console.error('Decompression failed:', error);
    console.log('Returning original buffer due to decompression failure');
    return buffer; // Return original if decompression fails
  }
};

// Cleanup old upload sessions (older than 1 hour)
const cleanupOldSessions = () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  uploadSessions.forEach((session, uploadId) => {
    if (session.createdAt < oneHourAgo) {
      // Clean up chunk files
      for (let i = 0; i < session.totalChunks; i++) {
        const chunkPath = path.join(chunksDir, `${uploadId}-chunk-${i}`);
        if (fs.existsSync(chunkPath)) {
          fs.unlinkSync(chunkPath);
        }
      }
      uploadSessions.delete(uploadId);
    }
  });
};

// Run cleanup every 30 minutes
setInterval(cleanupOldSessions, 30 * 60 * 1000);

// Authentication middleware
function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Render
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Debug endpoint to check environment and configuration
  app.get("/api/debug", (req: Request, res: Response) => {
    res.json({
      nodeEnv: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      hasStripe: !!process.env.STRIPE_SECRET_KEY,
      hasPerplexity: !!process.env.PERPLEXITY_API_KEY,
      timestamp: new Date().toISOString(),
      session: req.session ? "configured" : "missing",
      storageType: process.env.DATABASE_URL ? "database" : "memory"
    });
  });

  // Enhanced debug endpoint specifically for admin guide creation issues
  app.get("/api/debug/admin", (req: Request, res: Response) => {
    try {
      const debugInfo = {
        environment: process.env.NODE_ENV,
        hasDatabase: !!process.env.DATABASE_URL,
        databaseUrl: process.env.DATABASE_URL ? "configured" : "not set",
        sessionInfo: {
          sessionExists: !!req.session,
          sessionId: req.session?.id,
          isAuthenticated: req.session?.isAuthenticated,
          userId: req.session?.userId,
          username: req.session?.username
        },
        storageType: process.env.DATABASE_URL ? "PostgreSQL" : "MemStorage",
        timestamp: new Date().toISOString(),
        headers: {
          origin: req.headers.origin,
          userAgent: req.headers['user-agent']?.substring(0, 50) + '...',
          contentType: req.headers['content-type']
        }
      };
      
      console.log("Debug info requested:", debugInfo);
      res.json(debugInfo);
    } catch (error) {
      console.error("Debug endpoint error:", error);
      res.status(500).json({ 
        error: "Debug endpoint failed", 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  // Session debug endpoint to check session data
  app.get("/api/session-debug", (req: AuthenticatedRequest, res: Response) => {
    res.json({
      sessionExists: !!req.session,
      sessionId: req.session?.id,
      isAuthenticated: req.session?.isAuthenticated || false,
      userId: req.session?.userId || null,
      username: req.session?.username || null,
      sessionData: req.session || null
    });
  });

  // Authentication Routes
  app.post("/api/auth/login", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      // Simple hardcoded authentication
      const ADMIN_USERNAME = "admin";
      const ADMIN_PASSWORD = "admin123";

      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set session
        req.session.userId = 1;
        req.session.username = username;
        req.session.isAuthenticated = true;

        console.log("✅ Login successful - Session set:", {
          sessionId: req.session.id,
          userId: req.session.userId,
          username: req.session.username,
          isAuthenticated: req.session.isAuthenticated
        });

        res.json({
          success: true,
          user: {
            id: 1,
            username: username,
            email: "admin@guiaimmigration.com"
          }
        });
      } else {
        console.log("❌ Login failed - Invalid credentials:", { username, password });
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: AuthenticatedRequest, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req: AuthenticatedRequest, res: Response) => {
    console.log("Auth check - Session data:", {
      sessionExists: !!req.session,
      sessionId: req.session?.id,
      isAuthenticated: req.session?.isAuthenticated,
      userId: req.session?.userId,
      username: req.session?.username
    });

    if (req.session && req.session.isAuthenticated) {
      res.json({
        isAuthenticated: true,
        user: {
          id: req.session.userId,
          username: req.session.username
        }
      });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  // API Routes

  // Get all guides
  app.get("/api/guides", async (req: Request, res: Response) => {
    try {
      const { level } = req.query;
      let guides;

      if (level && level !== 'all') {
        guides = await storage.getGuidesBySkillLevel(level as string);
      } else {
        guides = await storage.getAllGuides();
      }

      res.json(guides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  // Get single guide by ID
  app.get("/api/guides/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log(`Fetching guide with ID: ${id}`);

      const guides = await storage.getAllGuides();
      console.log(`Total guides available: ${guides.length}`);
      console.log(`Available guide IDs: ${guides.map(g => g.id).join(', ')}`);
      
      const guide = guides.find(g => g.id === parseInt(id));
      console.log(`Found guide:`, guide ? `${guide.title} (ID: ${guide.id})` : 'null');
      
      if (!guide) {
        console.log(`Guide with ID ${id} not found`);
        return res.status(404).json({ error: "Guide not found" });
      }
      
      console.log(`Returning guide: ${guide.title}`);
      res.json(guide);
    } catch (error) {
      console.error(`Error fetching guide:`, error);
      res.status(500).json({ error: "Failed to fetch guide" });
    }
  });

  // Get featured guides
  app.get("/api/guides/featured", async (req: Request, res: Response) => {
    try {
      const guides = await storage.getFeaturedGuides();
      res.json(guides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured guides" });
    }
  });

  // Get guides by skill level
  app.get("/api/guides/skill/:level", async (req: Request, res: Response) => {
    try {
      const { level } = req.params;
      const guides = await storage.getGuidesBySkillLevel(level);
      res.json(guides);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch guides by skill level" });
    }
  });

  // Get USCIS data
  app.get("/api/uscis-data", async (req: Request, res: Response) => {
    try {
      const data = await storage.getUscisData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch USCIS data" });
    }
  });

  // Submit contact message
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      console.log("Contact form submission received:", req.body);
      const validatedData = insertContactMessageSchema.parse(req.body);
      console.log("Data validated successfully:", validatedData);

      const message = await storage.createContactMessage(validatedData);
      console.log("Message saved successfully:", message);

      res.status(201).json(message);
    } catch (error) {
      console.error("Contact form error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact message", details: (error as Error).message });
      }
    }
  });

  // AI Assistant endpoint using Perplexity API
  app.post("/api/ai-chat", async (req: Request, res: Response) => {
    try {
      const { message, language } = req.body;

      if (!process.env.PERPLEXITY_API_KEY) {
        throw new Error('Missing PERPLEXITY_API_KEY');
      }

      const systemPrompt = language === "es"
        ? "Eres un asistente especializado en inmigración estadounidense. Proporciona información precisa y útil sobre procesos de inmigración, pero siempre recuerda a los usuarios que consulten con un abogado de inmigración calificado para asesoramiento legal específico. No brindes asesoramiento legal directo."
        : "You are a U.S. immigration specialist assistant. Provide accurate and helpful information about immigration processes, but always remind users to consult with a qualified immigration attorney for specific legal advice. Do not provide direct legal advice.";

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.2,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content || "I apologize, but I couldn't process your question at this time. Please try again.";

      res.json({ response: aiResponse });
    } catch (error: any) {
      console.error('AI chat error:', error);
      const fallbackResponse = req.body.language === "es"
        ? "Lo siento, no pude procesar tu pregunta en este momento. Para obtener asistencia específica con tu caso de inmigración, te recomendamos consultar con un abogado de inmigración calificado."
        : "I apologize, but I couldn't process your question at this time. For specific assistance with your immigration case, we recommend consulting with a qualified immigration attorney.";

      res.json({ response: fallbackResponse });
    }
  });

  // Submit testimonial
  app.post("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit testimonial" });
      }
    }
  });

  // Stripe payment intent for translation orders
  app.post("/api/create-translation-payment-intent", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({
          message: "Payment system is not configured. Please contact support or check server configuration."
        });
      }

      const { amount, customerEmail } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "translation",
          customerEmail: customerEmail
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe payment intent for form purchases
  app.post("/api/create-form-payment-intent", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({
          message: "Payment system is not configured. Please contact support or check server configuration."
        });
      }

      const { amount, formId, customerEmail } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "form_guide",
          formId: formId,
          customerEmail: customerEmail
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Stripe payment intent for guide purchases
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({
          message: "Payment system is not configured. Please contact support or check server configuration."
        });
      }

      const { guideId, customerEmail } = req.body;

      // Get guide details to determine price
      const guides = await storage.getAllGuides();
      const guide = guides.find(g => g.id === guideId);

      if (!guide) {
        return res.status(404).json({ message: "Guide not found" });
      }

      const price = Number(guide.price);
      if (isNaN(price)) {
        return res.status(400).json({ message: "Invalid guide price" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100), // Convert to cents
        currency: "usd",
        metadata: {
          service: "immigration_guide",
          guideId: guideId.toString(),
          customerEmail: customerEmail
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Generate download link for purchased forms
  app.post("/api/generate-download-link", async (req: Request, res: Response) => {
    try {
      const { formId, guideId, customerEmail } = req.body;

      // Create a secure download token
      let tokenData;
      let guideName = '';
      let downloadUrls: string[] = [];

      if (guideId) {
        // New approach: use guideId for database guides
        tokenData = `guide-${guideId}-${customerEmail}-${Date.now()}`;

        // Get guide name for email
        const guides = await storage.getAllGuides();
        const guide = guides.find(g => g.id === guideId);
        guideName = guide ? guide.title : 'Immigration Guide';

        // Generate download URLs for both attachments
        const downloadToken = Buffer.from(tokenData).toString('base64');
        
        if (guide?.fileContent && guide?.fileName) {
          downloadUrls.push(`/api/download/${downloadToken}?attachment=1`);
        }
        
        if (guide?.fileContent2 && guide?.fileName2) {
          downloadUrls.push(`/api/download/${downloadToken}?attachment=2`);
        }

        // If no files available, create a placeholder
        if (downloadUrls.length === 0) {
          downloadUrls.push(`/api/download/${downloadToken}`);
        }
      } else {
        // Old approach: use formId for hardcoded forms
        tokenData = `form-${formId}-${customerEmail}-${Date.now()}`;
        guideName = `Form ${formId.toUpperCase()} Guide`;
        
        const downloadToken = Buffer.from(tokenData).toString('base64');
        downloadUrls.push(`/api/download/${downloadToken}`);
      }

      // Send email with download links
      console.log(`🔍 Checking email send conditions:`);
      console.log(`   Customer email: ${customerEmail}`);
      console.log(`   Is valid email: ${customerEmail && customerEmail !== "customer@example.com"}`);

      if (customerEmail && customerEmail !== "customer@example.com") {
        console.log(`📧 Sending email to: ${customerEmail}`);
        // For now, send the primary download URL in the email
        await sendDownloadEmail(customerEmail, downloadUrls[0], guideName);
      } else {
        console.log(`⏭️ Skipping email send (test email or missing)`);
      }

      res.json({ 
        downloadUrls, 
        expiresIn: '24 hours',
        attachmentCount: downloadUrls.length
      });
    } catch (error: any) {
      console.error("Error generating download link:", error);
      res.status(500).json({ message: "Error generating download link: " + error.message });
    }
  });

  // Download endpoint for purchased forms
  app.get("/api/download/:token", async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { attachment } = req.query; // Optional query parameter for which attachment (1 or 2)

      // Decode the token to get form info
      const decoded = Buffer.from(token, 'base64').toString();
      const parts = decoded.split('-');
      const type = parts[0]; // 'guide' or 'form'
      const id = parts[1];

      if (type === 'guide') {
        // New approach: serve file from database
        const guides = await storage.getAllGuides();
        const guide = guides.find(g => g.id === parseInt(id));

        if (!guide) {
          return res.status(404).json({ message: "Guide not found" });
        }

        // Determine which attachment to serve
        const attachmentNum = attachment === '2' ? 2 : 1;
        let fileContent: string | null;
        let fileName: string | null;
        let fileType: string | null;

        if (attachmentNum === 2) {
          fileContent = guide.fileContent2;
          fileName = guide.fileName2;
          fileType = guide.fileType2;
        } else {
          fileContent = guide.fileContent;
          fileName = guide.fileName;
          fileType = guide.fileType;
        }

        if (!fileContent || !fileName) {
          return res.status(404).json({ message: `Attachment ${attachmentNum} not available` });
        }

        // Convert base64 to buffer
        const fileBuffer = Buffer.from(fileContent, 'base64');

        // Set appropriate headers
        res.setHeader('Content-Type', fileType || 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', fileBuffer.length);

        // Send the file
        res.send(fileBuffer);
        return;
      }

      // Old approach: serve hardcoded files
      const formId = id;

      // Form file mappings
      const formFiles: Record<string, string> = {
        'i130': 'I-130_Family_Petition_Complete_Guide.pdf',
        'i485': 'I-485_Adjustment_Status_Complete_Guide.pdf',
        'n400': 'N-400_Naturalization_Complete_Guide.pdf',
        'i765': 'I-765_Work_Authorization_Complete_Guide.pdf',
        'i131': 'I-131_Travel_Document_Complete_Guide.pdf',
        'i751': 'I-751_Remove_Conditions_Complete_Guide.pdf',
        'i864': 'I-864_Affidavit_Support_Complete_Guide.pdf',
        'i129f': 'I-129F_Fiance_Visa_Complete_Guide.pdf',
        'i90': 'I-90_Green_Card_Renewal_Complete_Guide.pdf',
        'i601': 'I-601_Waiver_Application_Complete_Guide.pdf'
      };

      const fileName = formFiles[formId];
      if (!fileName) {
        return res.status(404).json({ message: "Form not found" });
      }

      // Set headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // For demo purposes, we'll create a simple PDF response
      // In production, you'd serve actual PDF files from storage
      const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${fileName.replace('.pdf', '')}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000110 00000 n 
0000000181 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
274
%%EOF`;

      res.send(pdfContent);
    } catch (error: any) {
      console.error("Error serving download:", error);
      res.status(500).json({ message: "Error serving download: " + error.message });
    }
  });

  // Translation Order Routes - This endpoint is now mainly for legacy support
  // Orders are primarily created during file upload
  app.post("/api/translation-orders", async (req: Request, res: Response) => {
    try {
      console.log("Creating translation order with data:", req.body);

      // Generate unique order number if not provided
      const orderNumber = req.body.orderNumber || 'TR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

      const orderData = {
        ...req.body,
        orderNumber,
        status: req.body.status || 'pending',
        originalFileContent: req.body.originalFileContent || null,
        translatedFileContent: req.body.translatedFileContent || null
      };

      console.log("Final order data to be saved:", { ...orderData, originalFileContent: orderData.originalFileContent ? '[BASE64_CONTENT]' : null });

      const order = await storage.createTranslationOrder(orderData);
      console.log("Order created successfully:", { ...order, originalFileContent: order.originalFileContent ? '[BASE64_CONTENT]' : null });

      res.json(order);
    } catch (error) {
      console.error("Error creating translation order:", error);
      res.status(500).json({ message: "Failed to create translation order", error: (error as Error).message });
    }
  });

  app.get("/api/translation-orders/:orderNumber", async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const order = await storage.getTranslationOrder(orderNumber);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching translation order:", error);
      res.status(500).json({ message: "Failed to fetch translation order" });
    }
  });

  app.get("/api/admin/translation-orders", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getAllTranslationOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching translation orders:", error);
      res.status(500).json({ message: "Failed to fetch translation orders" });
    }
  });

  app.patch("/api/admin/translation-orders/:orderNumber/status", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const { status, adminNotes } = req.body;

      console.log(`🔄 Updating order ${orderNumber} status to: ${status}`);
      console.log("Request body:", req.body);

      // First check if order exists
      const existingOrder = await storage.getTranslationOrder(orderNumber);
      if (!existingOrder) {
        console.log(`❌ Order ${orderNumber} not found`);
        return res.status(404).json({ message: "Order not found" });
      }

      console.log(`📋 Found existing order:`, existingOrder);

      const updatedOrder = await storage.updateTranslationOrderStatus(orderNumber, status, adminNotes);
      console.log(`✅ Order ${orderNumber} status updated successfully:`, updatedOrder);

      res.json(updatedOrder);
    } catch (error) {
      console.error("❌ Error updating translation order status:", error);
      res.status(500).json({ message: "Failed to update translation order status", error: (error as Error).message });
    }
  });

  app.patch("/api/admin/translation-orders/:orderNumber/files", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const { originalFilePath, translatedFilePath } = req.body;

      const order = await storage.updateTranslationOrderFiles(orderNumber, originalFilePath, translatedFilePath);
      res.json(order);
    } catch (error) {
      console.error("Error updating translation order files:", error);
      res.status(500).json({ message: "Failed to update translation order files" });
    }
  });

  // Public endpoint for updating payment status after successful payment
  app.patch("/api/translation-orders/:orderNumber/payment-status", async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const { paymentIntentId } = req.body;

      console.log(`🔄 Updating payment status for order ${orderNumber}`);
      console.log("Request body:", req.body);

      // First check if order exists
      const existingOrder = await storage.getTranslationOrder(orderNumber);
      if (!existingOrder) {
        console.log(`❌ Order ${orderNumber} not found`);
        return res.status(404).json({ message: "Order not found" });
      }

      console.log(`📋 Found existing order:`, { ...existingOrder, originalFileContent: existingOrder.originalFileContent ? '[BASE64_CONTENT]' : null });

      // Update order status to 'paid' and store payment intent ID
      const updatedOrder = await storage.updateTranslationOrderStatus(
        orderNumber,
        'paid',
        `Payment completed successfully. Payment Intent: ${paymentIntentId || 'N/A'}`,
        paymentIntentId
      );
      console.log(`✅ Order ${orderNumber} payment status updated successfully:`, { ...updatedOrder, originalFileContent: updatedOrder.originalFileContent ? '[BASE64_CONTENT]' : null });

      res.json(updatedOrder);
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status", error: (error as Error).message });
    }
  });

  // File upload endpoint for translation orders
  app.post("/api/upload-translation-file", largeFileUpload.single('file'), async (req: any, res: Response) => {
    try {
      console.log("File upload request received");
      console.log("Request body:", req.body);
      console.log("Request file:", req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      } : "No file");

      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { customerEmail, orderDetails } = req.body;

      if (!customerEmail) {
        console.log("No customer email provided");
        return res.status(400).json({ message: "Customer email is required" });
      }

      // Parse order details if provided as string
      let parsedOrderDetails;
      try {
        parsedOrderDetails = typeof orderDetails === 'string' ? JSON.parse(orderDetails) : orderDetails;
        console.log("Parsed order details:", parsedOrderDetails);
      } catch (error) {
        console.log("Error parsing order details:", error);
        return res.status(400).json({ message: "Invalid order details format" });
      }

      // Read file content and convert to base64 for database storage
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileContentBase64 = fileBuffer.toString('base64');

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);

      console.log("File processed successfully:", {
        originalName: req.file.originalname,
        size: req.file.size,
        contentLength: fileContentBase64.length
      });

      // Generate unique order number
      const orderNumber = 'TR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

      // Create the translation order with file content stored in database
      const orderData = {
        orderNumber,
        customerEmail,
        customerPhone: parsedOrderDetails.customerPhone || null,
        originalFileName: req.file.originalname,
        fileType: req.file.mimetype,
        pageCount: parsedOrderDetails.pageCount || 1,
        deliveryType: parsedOrderDetails.deliveryType || 'standard',
        totalPrice: parsedOrderDetails.totalPrice?.toString() || '25.00',
        status: 'pending',
        originalFilePath: null, // No longer storing file path
        translatedFilePath: null,
        originalFileContent: fileContentBase64, // Store file content as base64
        translatedFileContent: null,
        adminNotes: null,
        paymentIntentId: null
      };

      console.log("Creating translation order with file content in database");
      const order = await storage.createTranslationOrder(orderData);
      console.log("Order created successfully:", { ...order, originalFileContent: '[BASE64_CONTENT]' });

      res.json({
        success: true,
        orderNumber: order.orderNumber,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        message: "File uploaded and order created successfully"
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Error uploading file: " + error.message });
    }
  });

  // Multiple file upload endpoint for translation orders
  app.post("/api/upload-translation-files", largeFileUpload.fields([
    { name: 'file_0', maxCount: 1 },
    { name: 'file_1', maxCount: 1 },
    { name: 'file_2', maxCount: 1 },
    { name: 'file_3', maxCount: 1 },
    { name: 'file_4', maxCount: 1 },
    { name: 'file_5', maxCount: 1 },
    { name: 'file_6', maxCount: 1 },
    { name: 'file_7', maxCount: 1 },
    { name: 'file_8', maxCount: 1 },
    { name: 'file_9', maxCount: 1 }
  ]), async (req: any, res: Response) => {
    try {
      console.log("Multiple file upload request received");
      console.log("Request body:", req.body);
      console.log("Request files:", req.files ? req.files.map((file: any) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path
      })) : "No files");

      // Check for files uploaded with file_0, file_1, etc. naming
      const files = [];
      const fileKeys = Object.keys(req.files || {});
      
      if (req.files && Array.isArray(req.files)) {
        files.push(...req.files);
      } else if (req.files) {
        // Handle files uploaded with specific field names like file_0, file_1
        for (const key of fileKeys) {
          if (key.startsWith('file_')) {
            const fileArray = req.files[key];
            if (Array.isArray(fileArray)) {
              files.push(...fileArray);
            } else {
              files.push(fileArray);
            }
          }
        }
      }

      if (files.length === 0) {
        console.log("No files in request");
        return res.status(400).json({ message: "No files uploaded" });
      }

      const { customerEmail, orderDetails, fileCount } = req.body;

      if (!customerEmail) {
        console.log("No customer email provided");
        return res.status(400).json({ message: "Customer email is required" });
      }

      // Parse order details if provided as string
      let parsedOrderDetails;
      try {
        parsedOrderDetails = typeof orderDetails === 'string' ? JSON.parse(orderDetails) : orderDetails;
        console.log("Parsed order details:", parsedOrderDetails);
      } catch (error) {
        console.log("Error parsing order details:", error);
        return res.status(400).json({ message: "Invalid order details format" });
      }

      // Process all files and store their content as base64
      const fileContents = [];
      for (const file of files) {
        const fileBuffer = fs.readFileSync(file.path);
        const fileContentBase64 = fileBuffer.toString('base64');
        
        fileContents.push({
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          content: fileContentBase64
        });

        // Clean up the temporary file
        fs.unlinkSync(file.path);
      }

      console.log("Files processed successfully:", fileContents.map(f => ({
        originalName: f.originalName,
        size: f.size,
        contentLength: f.content.length
      })));

      // Generate unique order number
      const orderNumber = 'TR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();

      // Create the translation order with multiple files content stored in database
      const orderData = {
        orderNumber,
        customerEmail,
        customerPhone: parsedOrderDetails.customerPhone || null,
        originalFileName: parsedOrderDetails.fileNames ? parsedOrderDetails.fileNames.join(', ') : files.map(f => f.originalname).join(', '),
        fileType: files.map(f => f.mimetype).join(', '),
        pageCount: parsedOrderDetails.pageCount || files.length,
        deliveryType: parsedOrderDetails.deliveryType || 'standard',
        totalPrice: parsedOrderDetails.totalPrice?.toString() || '25.00',
        status: 'pending',
        originalFilePath: null,
        translatedFilePath: null,
        originalFileContent: JSON.stringify(fileContents), // Store all files as JSON
        translatedFileContent: null,
        adminNotes: null,
        paymentIntentId: null
      };

      console.log("Creating translation order with multiple file contents in database");
      const order = await storage.createTranslationOrder(orderData);
      console.log("Order created successfully:", { ...order, originalFileContent: '[MULTIPLE_FILES_BASE64_CONTENT]' });

      res.json({
        success: true,
        orderNumber: order.orderNumber,
        files: fileContents.map(f => ({
          originalName: f.originalName,
          size: f.size,
          mimetype: f.mimeType
        })),
        totalSize: fileContents.reduce((sum, f) => sum + f.size, 0),
        fileCount: fileContents.length,
        message: "Files uploaded and order created successfully"
      });
    } catch (error: any) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Error uploading files: " + error.message });
    }
  });

  // Test endpoint to verify database storage
  app.get("/api/test-database", async (req: Request, res: Response) => {
    try {
      console.log("Testing database connection and storage...");

      // Test creating a simple translation order
      const testOrder = {
        orderNumber: 'TEST-' + Date.now(),
        customerEmail: 'test@example.com',
        customerPhone: '123-456-7890',
        originalFileName: 'test-document.pdf',
        fileType: 'application/pdf',
        pageCount: 1,
        deliveryType: 'standard',
        totalPrice: '25.00',
        status: 'test',
        originalFilePath: 'uploads/test/test-file.pdf'
      };

      console.log("Creating test order:", testOrder);
      const createdOrder = await storage.createTranslationOrder(testOrder);
      console.log("Test order created successfully:", createdOrder);

      // Fetch all orders to verify
      const allOrders = await storage.getAllTranslationOrders();
      console.log("Total orders in database:", allOrders.length);

      res.json({
        success: true,
        message: "Database storage is working correctly",
        testOrder: createdOrder,
        totalOrders: allOrders.length,
        recentOrders: allOrders.slice(-3)
      });
    } catch (error) {
      console.error("Database test failed:", error);
      res.status(500).json({
        success: false,
        message: "Database storage test failed",
      });
    }
  });

  // Admin Guide Management Routes
  app.get("/api/admin/guides", async (req: Request, res: Response) => {
    try {
      const guides = await storage.getAllGuides();
      res.json(guides);
    } catch (error) {
      console.error("Error fetching guides:", error);
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.post("/api/admin/guides", async (req: Request, res: Response) => {
    try {
      console.log("🔧 Creating new guide with data:", req.body);
      console.log("🔧 Session info:", {
        sessionExists: !!req.session,
        sessionId: req.session?.id,
        isAuthenticated: req.session?.isAuthenticated
      });
      
      const guide = await storage.createGuide(req.body);
      console.log("✅ Guide created successfully:", { id: guide.id, title: guide.title });
      res.json(guide);
    } catch (error) {
      console.error("❌ Error creating guide:", error);
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null,
        requestBody: req.body
      });
      res.status(500).json({ error: "Failed to create guide", details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.patch("/api/admin/guides/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const guide = await storage.updateGuide(parseInt(id), req.body);
      res.json(guide);
    } catch (error) {
      console.error("Error updating guide:", error);
      res.status(500).json({ error: "Failed to update guide" });
    }
  });

  app.delete("/api/admin/guides/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteGuide(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting guide:", error);
      res.status(500).json({ error: "Failed to delete guide" });
    }
  });

  // File upload endpoint for guide files
  app.post("/api/admin/guides/:id/upload-file", largeFileUpload.single('file'), async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { attachmentNumber = 1 } = req.body;
      
      console.log(`📁 Regular file upload for guide ${id}, attachment ${attachmentNumber}`);
      console.log(`📁 File details:`, {
        originalname: req.file?.originalname,
        size: req.file?.size,
        mimetype: req.file?.mimetype
      });
      
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate attachment number
      if (parseInt(attachmentNumber) !== 1 && parseInt(attachmentNumber) !== 2) {
        return res.status(400).json({ message: "Invalid attachment number. Must be 1 or 2." });
      }

      // Read file content and convert to base64
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileContentBase64 = fileBuffer.toString('base64');

      console.log(`📁 File processed: ${fileBuffer.length} bytes -> ${fileContentBase64.length} base64 chars`);

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);

      // Update guide with file information based on attachment number
      const updateData: any = {};
      const attachNum = parseInt(attachmentNumber);
      if (attachNum === 2) {
        updateData.fileName2 = req.file.originalname;
        updateData.fileContent2 = fileContentBase64;
        updateData.fileType2 = req.file.mimetype;
      } else {
        updateData.fileName = req.file.originalname;
        updateData.fileContent = fileContentBase64;
        updateData.fileType = req.file.mimetype;
      }

      const updatedGuide = await storage.updateGuide(parseInt(id), updateData);
      console.log(`✅ Guide ${id} updated successfully with attachment ${attachNum}`);

      res.json({
        success: true,
        guide: updatedGuide,
        attachmentNumber: attachNum,
        message: `Attachment ${attachNum} uploaded successfully`
      });
    } catch (error: any) {
      console.error("❌ Error uploading guide file:", error);
      res.status(500).json({ message: "Error uploading file: " + error.message });
    }
  });

  // Enhanced large file upload endpoints for guide files

  // Initialize chunked upload session
  app.post("/api/admin/guides/:id/upload-large-file/init", async (req: Request, res: Response) => {
    try {
      const { fileName, fileSize, totalChunks, fileType, compressed, attachmentNumber = 1 } = req.body;
      const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(fileType)) {
        return res.status(400).json({
          message: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.'
        });
      }

      // Validate attachment number
      if (attachmentNumber !== 1 && attachmentNumber !== 2) {
        return res.status(400).json({
          message: 'Invalid attachment number. Must be 1 or 2.'
        });
      }

      // Create upload session
      const session: UploadSession = {
        uploadId,
        fileName,
        fileSize,
        totalChunks,
        receivedChunks: new Set(),
        fileType,
        compressed: compressed || false,
        createdAt: new Date()
      };

      uploadSessions.set(uploadId, session);

      res.json({
        success: true,
        uploadId,
        attachmentNumber,
        message: `Upload session initialized for attachment ${attachmentNumber}`
      });
    } catch (error: any) {
      console.error("Error initializing upload session:", error);
      res.status(500).json({ message: "Error initializing upload: " + error.message });
    }
  });

  // Upload chunk
  app.post("/api/admin/guides/:id/upload-large-file/chunk", chunkUpload.single('chunk'), async (req: any, res: Response) => {
    try {
      const { uploadId, chunkIndex } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No chunk uploaded" });
      }

      const session = uploadSessions.get(uploadId);
      if (!session) {
        return res.status(400).json({ message: "Invalid upload session" });
      }

      // Mark chunk as received
      session.receivedChunks.add(parseInt(chunkIndex));

      res.json({
        success: true,
        receivedChunks: session.receivedChunks.size,
        totalChunks: session.totalChunks,
        progress: (session.receivedChunks.size / session.totalChunks) * 100
      });
    } catch (error: any) {
      console.error("Error uploading chunk:", error);
      res.status(500).json({ message: "Error uploading chunk: " + error.message });
    }
  });

  // Complete chunked upload
  app.post("/api/admin/guides/:id/upload-large-file/complete", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { uploadId, attachmentNumber = 1 } = req.body;

      const session = uploadSessions.get(uploadId);
      if (!session) {
        return res.status(400).json({ message: "Invalid upload session" });
      }

      // Check if all chunks are received
      if (session.receivedChunks.size !== session.totalChunks) {
        return res.status(400).json({
          message: `Missing chunks. Received ${session.receivedChunks.size}/${session.totalChunks}`
        });
      }

      // Reassemble file from chunks
      const chunks: Buffer[] = [];
      for (let i = 0; i < session.totalChunks; i++) {
        const chunkPath = path.join(chunksDir, `${uploadId}-chunk-${i}`);
        if (!fs.existsSync(chunkPath)) {
          throw new Error(`Missing chunk ${i}`);
        }
        chunks.push(fs.readFileSync(chunkPath));
      }

      // Combine chunks
      let fileBuffer: Buffer = Buffer.concat(chunks);

      // Decompress if file was compressed
      if (session.compressed) {
        const decompressedBuffer = decompressFile(fileBuffer);
        fileBuffer = decompressedBuffer;
      }

      // Convert to base64 for database storage
      const fileContentBase64 = fileBuffer.toString('base64');

      // Update guide with file information based on attachment number
      const updateData: any = {};
      if (attachmentNumber === 2) {
        updateData.fileName2 = session.fileName;
        updateData.fileContent2 = fileContentBase64;
        updateData.fileType2 = session.fileType;
      } else {
        updateData.fileName = session.fileName;
        updateData.fileContent = fileContentBase64;
        updateData.fileType = session.fileType;
      }

      const updatedGuide = await storage.updateGuide(parseInt(id), updateData);

      // Clean up chunks
      for (let i = 0; i < session.totalChunks; i++) {
        const chunkPath = path.join(chunksDir, `${uploadId}-chunk-${i}`);
        if (fs.existsSync(chunkPath)) {
          fs.unlinkSync(chunkPath);
        }
      }

      // Remove upload session
      uploadSessions.delete(uploadId);

      res.json({
        success: true,
        guide: updatedGuide,
        attachmentNumber,
        message: `Attachment ${attachmentNumber} uploaded successfully`
      });
    } catch (error: any) {
      console.error("Error completing upload:", error);
      res.status(500).json({ message: "Error completing upload: " + error.message });
    }
  });

  // Direct large file upload (non-chunked, with compression support)
  app.post("/api/admin/guides/:id/upload-large-file-direct", largeFileUpload.single('file'), async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { compressed, attachmentNumber = 1 } = req.body;

      console.log(`📁 Large file upload for guide ${id}, attachment ${attachmentNumber}`);
      console.log(`📁 Compression flag: ${compressed}`);
      console.log(`📁 File details:`, {
        originalname: req.file?.originalname,
        size: req.file?.size,
        mimetype: req.file?.mimetype
      });

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate attachment number
      if (parseInt(attachmentNumber) !== 1 && parseInt(attachmentNumber) !== 2) {
        return res.status(400).json({ message: "Invalid attachment number. Must be 1 or 2." });
      }

      // Read file content
      let fileBuffer: Buffer = fs.readFileSync(req.file.path);
      console.log(`📁 Original file buffer size: ${fileBuffer.length} bytes`);

      // Only decompress if file was actually compressed
      if (compressed === 'true') {
        console.log(`📁 Attempting to decompress file...`);
        const decompressedBuffer = decompressFile(fileBuffer);
        if (decompressedBuffer !== fileBuffer) {
          console.log(`📁 File decompressed: ${fileBuffer.length} -> ${decompressedBuffer.length} bytes`);
        } else {
          console.log(`📁 File was not actually compressed or decompression failed`);
        }
        fileBuffer = decompressedBuffer;
      } else {
        console.log(`📁 File not marked as compressed, using as-is`);
      }

      // Convert to base64 for database storage
      const fileContentBase64 = fileBuffer.toString('base64');
      console.log(`📁 Base64 content size: ${fileContentBase64.length} characters`);

      // Clean up the temporary file
      fs.unlinkSync(req.file.path);

      // Update guide with file information based on attachment number
      const updateData: any = {};
      const attachNum = parseInt(attachmentNumber);
      if (attachNum === 2) {
        updateData.fileName2 = req.file.originalname;
        updateData.fileContent2 = fileContentBase64;
        updateData.fileType2 = req.file.mimetype;
      } else {
        updateData.fileName = req.file.originalname;
        updateData.fileContent = fileContentBase64;
        updateData.fileType = req.file.mimetype;
      }

      const updatedGuide = await storage.updateGuide(parseInt(id), updateData);
      console.log(`✅ Guide ${id} updated successfully with attachment ${attachNum}`);

      res.json({
        success: true,
        guide: updatedGuide,
        attachmentNumber: attachNum,
        message: `Attachment ${attachNum} uploaded successfully`
      });
    } catch (error: any) {
      console.error("❌ Error uploading large file:", error);
      res.status(500).json({ message: "Error uploading large file: " + error.message });
    }
  });

  // Admin Payments (translation_orders only)
  app.get("/api/admin/payments", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getAllTranslationOrders();
      // Map translation order fields to PaymentRecord interface
      const payments = orders.map(order => ({
        id: order.paymentIntentId || order.orderNumber || String(order.id),
        amount: parseFloat(order.totalPrice),
        currency: "usd", // assuming USD for all
        status: order.status === 'paid' || order.status === 'succeeded' ? 'succeeded' : (order.status || 'pending'),
        customerEmail: order.customerEmail,
        service: 'translation',
        serviceId: order.orderNumber,
        paymentMethod: 'card', // assuming card for all
        createdAt: order.createdAt,
        metadata: {
          orderNumber: order.orderNumber,
          originalFileName: order.originalFileName,
          deliveryType: order.deliveryType,
          pageCount: order.pageCount
        }
      }));
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Payment stats endpoint for admin panel cards
  app.get("/api/admin/payment-stats", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getAllTranslationOrders();
      const payments = orders.map(order => ({
        id: order.paymentIntentId || order.orderNumber || String(order.id),
        amount: parseFloat(order.totalPrice),
        currency: "usd",
        status: order.status === 'paid' || order.status === 'succeeded' ? 'succeeded' : (order.status || 'pending'),
        customerEmail: order.customerEmail,
        service: 'translation',
        serviceId: order.orderNumber,
        paymentMethod: 'card',
        createdAt: order.createdAt,
        metadata: {
          orderNumber: order.orderNumber,
          originalFileName: order.originalFileName,
          deliveryType: order.deliveryType,
          pageCount: order.pageCount
        }
      }));

      // Compute stats
      const totalRevenue = payments.reduce((sum, p) => p.status === 'succeeded' ? sum + p.amount : sum, 0);
      const totalTransactions = payments.length;
      const successfulPayments = payments.filter(p => p.status === 'succeeded').length;
      const failedPayments = payments.filter(p => p.status === 'failed').length;

      // Monthly revenue for last 12 months
      const monthlyRevenue: number[] = Array(12).fill(0);
      const now = new Date();
      payments.forEach(p => {
        if (p.status === 'succeeded' && p.createdAt) {
          const created = new Date(p.createdAt);
          const monthsAgo = (now.getFullYear() - created.getFullYear()) * 12 + (now.getMonth() - created.getMonth());
          if (monthsAgo >= 0 && monthsAgo < 12) {
            monthlyRevenue[11 - monthsAgo] += p.amount;
          }
        }
      });

      // Recent payments (last 5 by createdAt desc)
      const recentPayments = [...payments]
        .filter(p => p.createdAt) // Filter out payments without createdAt
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5);

      res.json({
        totalRevenue,
        totalTransactions,
        successfulPayments,
        failedPayments,
        monthlyRevenue,
        recentPayments
      });
    } catch (error) {
      console.error("Error fetching payment stats:", error);
      res.status(500).json({ message: "Failed to fetch payment stats" });
    }
  });

  // User Management Routes (Admin only)
  app.get("/api/admin/users", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: new Date().toISOString() // Mock created date for now
      }));
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      // Remove password from response
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: new Date().toISOString()
      };
      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  app.put("/api/admin/users/:id", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(parseInt(id), req.body);
      // Remove password from response
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: new Date().toISOString()
      };
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteUser(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin Routes
  app.get("/api/admin/dashboard-stats", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const contacts = await storage.getAllContactMessages();
      const orders = await storage.getAllTranslationOrders();
      // ... (rest of the code remains the same)
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalPrice), 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      const stats = {
        totalContacts: contacts.length,
        totalOrders: orders.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingOrders,
        recentContacts: contacts.slice(-5),
        recentOrders: orders.slice(-5)
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.get("/api/admin/contacts", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const contacts = await storage.getAllContactMessages();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.delete("/api/admin/contacts/:id", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteContactMessage(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });



  // Delete translation order endpoint
  app.delete("/api/admin/translation-orders/:orderNumber", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { orderNumber } = req.params;
      console.log(`🗑️ Attempting to delete order: ${orderNumber}`);

      // First check if order exists
      const existingOrder = await storage.getTranslationOrder(orderNumber);
      if (!existingOrder) {
        console.log(`❌ Order ${orderNumber} not found`);
        return res.status(404).json({ message: "Order not found" });
      }

      console.log(`📋 Found order to delete:`, { ...existingOrder, originalFileContent: existingOrder.originalFileContent ? '[BASE64_CONTENT]' : null });

      await storage.deleteTranslationOrder(orderNumber);
      console.log(`✅ Order ${orderNumber} deleted successfully`);

      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      console.error("❌ Error deleting translation order:", error);
      res.status(500).json({ error: "Failed to delete translation order", details: (error as Error).message });
    }
  });

  // Translation Pricing Admin Routes
  app.get("/api/admin/translation-pricing", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const pricing = await storage.getAllTranslationPricing();
      res.json(pricing);
    } catch (error) {
      console.error("Error fetching translation pricing:", error);
      res.status(500).json({ error: "Failed to fetch translation pricing" });
    }
  });

  app.get("/api/admin/translation-pricing/active", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const pricing = await storage.getActiveTranslationPricing();
      res.json(pricing);
    } catch (error) {
      console.error("Error fetching active translation pricing:", error);
      res.status(500).json({ error: "Failed to fetch active translation pricing" });
    }
  });

  app.post("/api/admin/translation-pricing", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertTranslationPricingSchema.parse(req.body);
      const pricing = await storage.createTranslationPricing(validatedData);
      res.status(201).json(pricing);
    } catch (error) {
      console.error("Error creating translation pricing:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create translation pricing" });
      }
    }
  });

  app.put("/api/admin/translation-pricing/:id", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const pricing = await storage.updateTranslationPricing(parseInt(id), req.body);
      res.json(pricing);
    } catch (error) {
      console.error("Error updating translation pricing:", error);
      res.status(500).json({ error: "Failed to update translation pricing" });
    }
  });

  app.delete("/api/admin/translation-pricing/:id", async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteTranslationPricing(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting translation pricing:", error);
      res.status(500).json({ error: "Failed to delete translation pricing" });
    }
  });

  // Don't start the server here - it will be started in index.ts
  return app as any;
}