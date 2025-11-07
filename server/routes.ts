import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChequeSchema } from "@shared/schema";
import { queryCheques } from "./gemini";
import { sendChequeAlert } from "./whatsapp";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/cheques - Query cheques with optional filters
  app.get("/api/cheques", async (req, res) => {
    try {
      const { status, issueStart, issueEnd, dueStart, dueEnd } = req.query;

      const filters: any = {};
      if (status && typeof status === "string") filters.status = status;
      if (issueStart && typeof issueStart === "string") filters.issueStart = issueStart;
      if (issueEnd && typeof issueEnd === "string") filters.issueEnd = issueEnd;
      if (dueStart && typeof dueStart === "string") filters.dueStart = dueStart;
      if (dueEnd && typeof dueEnd === "string") filters.dueEnd = dueEnd;

      const cheques = await storage.getCheques(filters);
      res.json(cheques);
    } catch (error) {
      console.error("Error fetching cheques:", error);
      res.status(500).json({ error: "Failed to fetch cheques" });
    }
  });

  // POST /api/cheques - Create a new cheque
  app.post("/api/cheques", async (req, res) => {
    try {
      const validatedData = insertChequeSchema.parse(req.body);
      const cheque = await storage.createCheque(validatedData);
      
      // Send WhatsApp alert (non-blocking, don't wait for it)
      sendChequeAlert(cheque).catch((error) => {
        console.error("WhatsApp alert failed (non-critical):", error);
      });
      
      res.status(201).json(cheque);
    } catch (error) {
      console.error("Error creating cheque:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create cheque" });
      }
    }
  });

  // POST /api/chat - AI chatbot for querying cheques
  app.post("/api/chat", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Query is required" });
      }

      const allCheques = await storage.getCheques();
      const response = await queryCheques(query, allCheques);
      
      res.json({ response });
    } catch (error: any) {
      console.error("Error processing chat query:", error);
      if (error.message?.includes("not available") || error.message?.includes("not configured")) {
        return res.status(503).json({ 
          error: "Chatbot service is currently unavailable. Please contact the administrator to configure GEMINI_API_KEY." 
        });
      }
      res.status(500).json({ error: "Failed to process your query. Please try again." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
