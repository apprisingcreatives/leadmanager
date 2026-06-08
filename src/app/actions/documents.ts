"use server";

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import pdfParse from "pdf-parse";

export type ProcessedDocument = {
  id: string;
  fileName: string;
  status: "processing" | "completed" | "error";
  summary?: string;
  budget?: string;
  timeline?: string;
  services?: string[];
  processedAt?: string;
  leadName?: string;
  leadCompany?: string;
  leadIndustry?: string;
  extractedLeads?: Array<{
    name: string;
    company: string;
    industry: string;
    budget?: string;
  }>;
};

// Define the structured output format for the LLM
const ExtractedLeadsSchema = z.object({
  summary: z.string(),
  leads: z.array(z.object({
    name: z.string(),
    company: z.string(),
    industry: z.string(),
    budget: z.string().nullable()
  }))
});

export async function uploadDocument(formData: FormData): Promise<ProcessedDocument> {
  const file = formData.get("file") as File;
  
  if (!file) {
    throw new Error("No file provided");
  }

  const fileName = file.name || "uploaded_document.pdf";
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    throw new Error("Missing OPENAI_API_KEY. Please add it to your .env.local file.");
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const pdfData = await pdfParse(buffer);
    const textContent = pdfData.text;

    const openai = new OpenAI({ apiKey: openAiKey });

    const completion = await openai.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert sales assistant. Read the provided document text and extract all potential B2B leads. Include their Name, Company, Industry, and any estimated Deal Value or Budget mentioned." },
        { role: "user", content: `Extract leads from the following text:\n\n${textContent.substring(0, 150000)}` }
      ],
      response_format: zodResponseFormat(ExtractedLeadsSchema, "extracted_leads"),
    });

    const parsedData = completion.choices[0].message.parsed;
    
    if (!parsedData) {
      throw new Error("AI failed to extract leads.");
    }

    return {
      id: Math.random().toString(36).substring(7),
      fileName: fileName,
      status: "completed",
      summary: parsedData.summary,
      extractedLeads: parsedData.leads,
      processedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    throw new Error(error.message || "Failed to process PDF and extract leads");
  }
}
