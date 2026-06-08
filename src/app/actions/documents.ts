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
    budget?: string | null;
    address?: string | null;
    clinic_hours?: string | null;
    tel?: string | null;
    fax?: string | null;
  }>;
};

// Define the structured output format for the LLM
const ExtractedLeadsSchema = z.object({
  summary: z.string(),
  leads: z.array(z.object({
    name: z.string(),
    company: z.string(),
    industry: z.string(),
    budget: z.string().nullable(),
    address: z.string().nullable(),
    clinic_hours: z.string().nullable(),
    tel: z.string().nullable(),
    fax: z.string().nullable()
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

    const chunkSize = 25000;
    const chunks = [];
    for (let i = 0; i < textContent.length; i += chunkSize) {
      chunks.push(textContent.substring(i, i + chunkSize));
    }

    const chunkPromises = chunks.map(chunk => 
      openai.chat.completions.parse({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert data extractor. Read the provided document text and extract all B2B leads (clinics/hospitals). Include Name, Company, Industry (use 'Healthcare'), Budget, Address, Clinic Hours, Tel, and Fax numbers." },
          { role: "user", content: `Extract leads from the following text:\n\n${chunk}` }
        ],
        response_format: zodResponseFormat(ExtractedLeadsSchema, "extracted_leads"),
      }).catch(e => { console.error("Chunk processing error:", e); return null; })
    );

    const results = await Promise.all(chunkPromises);
    
    let allLeads: Array<{ name: string; company: string; industry: string; budget?: string | null; address?: string | null; clinic_hours?: string | null; tel?: string | null; fax?: string | null; }> = [];
    let summary = "Extracted from large document.";
    
    results.forEach(res => {
      if (res && res.choices[0].message.parsed) {
        allLeads = allLeads.concat(res.choices[0].message.parsed.leads);
        if (res.choices[0].message.parsed.summary) summary = res.choices[0].message.parsed.summary;
      }
    });

    return {
      id: Math.random().toString(36).substring(7),
      fileName: fileName,
      status: "completed",
      summary: summary,
      extractedLeads: allLeads,
      processedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    throw new Error(error.message || "Failed to process PDF and extract leads");
  }
}
