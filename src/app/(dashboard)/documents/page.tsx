"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileText, File, Loader2, UserPlus } from "lucide-react";
import { uploadDocument, type ProcessedDocument } from "@/app/actions/documents";
import { useLeads } from "@/lib/context/LeadsContext";

export default function DocumentsPage() {
  const { addLead } = useLeads();
  const [isDragging, setIsDragging] = useState(false);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([
    {
      id: "demo-1",
      fileName: "Project_RFP_2026.pdf",
      status: "completed",
      summary: "TechNova is seeking a complete overhaul of their internal inventory management system. They require a web application with real-time sync, role-based access, and integrations with their existing logistics API.",
      budget: "$80,000 - $120,000",
      timeline: "Q3 2026",
      services: ["Web App Development", "API Integration", "Database Design"],
      processedAt: "2 hours ago"
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file) return;

    const tempId = Math.random().toString(36).substring(7);
    
    // Add temporary processing document
    setDocuments(prev => [
      {
        id: tempId,
        fileName: file.name,
        status: "processing"
      },
      ...prev
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadDocument(formData);
      
      // Auto-create a lead from the extracted document data
      if (result.status === "completed") {
        if (result.extractedLeads && result.extractedLeads.length > 0) {
           result.extractedLeads.forEach(lead => {
             addLead({
               id: Math.random().toString(36).substring(7),
               name: lead.name,
               companyName: lead.company,
               industry: lead.industry,
               value: parseInt(lead.budget?.replace(/[^0-9]/g, '').slice(0, 5) || "10000"),
               aiScore: Math.floor(Math.random() * 20) + 75,
               status: 'Discovered'
             });
           });
        } else {
          addLead({
            id: Math.random().toString(36).substring(7),
            name: result.leadName || "Unknown Client",
            companyName: result.leadCompany || "Unknown Company",
            industry: result.leadIndustry || "General",
            value: parseInt(result.budget?.replace(/[^0-9]/g, '').slice(0, 5) || "15000"),
            aiScore: 94,
            status: 'Discovered'
          });
        }
      }

      // Update the temp document with the completed result
      setDocuments(prev => prev.map(doc => 
        doc.id === tempId ? result : doc
      ));
    } catch (error) {
      console.error("Upload failed", error);
      setDocuments(prev => prev.map(doc => 
        doc.id === tempId ? { ...doc, status: "error" } : doc
      ));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight">Document Intelligence</h2>
          <p className="text-muted-foreground">Upload PDFs and let AI extract key requirements, budgets, and timelines.</p>
        </div>
      </div>

      <div 
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
        />
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Drag & Drop PDFs Here</h3>
        <p className="text-sm text-muted-foreground mb-4">Upload RFPs, requirements, or client briefs up to 50MB.</p>
        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
          Select Files
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {documents.map((doc) => (
          <Card key={doc.id} className={doc.status === "processing" ? "border-primary/50 shadow-md transition-all duration-500" : "transition-all duration-500"}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.status === "processing" ? "bg-secondary" : "bg-primary/10"
                }`}>
                  {doc.status === "processing" ? (
                    <File className="w-5 h-5 text-muted-foreground animate-pulse" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate" title={doc.fileName}>{doc.fileName}</CardTitle>
                  <CardDescription>
                    {doc.status === "processing" ? "Processing..." : `Processed ${doc.processedAt}`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {doc.status === "processing" ? (
                <div className="flex items-center justify-center h-48 border-t text-muted-foreground flex-col">
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 mb-4 opacity-50 animate-spin text-primary" />
                    <p className="text-sm font-medium">AI is reading the document...</p>
                    <p className="text-xs opacity-70 mt-1">Extracting budget and timeline</p>
                  </div>
                </div>
              ) : doc.status === "error" ? (
                <div className="flex items-center justify-center h-32 border-t text-destructive flex-col">
                  <p className="text-sm font-medium">Error processing document.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg text-sm leading-relaxed">
                    <strong className="block mb-2 text-foreground">AI Executive Summary:</strong>
                    {doc.summary}
                  </div>
                  
                  {doc.extractedLeads ? (
                    <div>
                       <span className="text-xs text-muted-foreground block mb-2 uppercase tracking-wider font-bold">Extracted Leads</span>
                       <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                         {doc.extractedLeads.map((l, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-md border border-slate-200 text-sm">
                               <div>
                                 <div className="font-semibold text-slate-800">{l.name}</div>
                                 <div className="text-xs text-slate-500">{l.company}</div>
                               </div>
                               <Badge variant="secondary" className="text-[10px] bg-slate-200 text-slate-700">{l.budget}</Badge>
                            </div>
                         ))}
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Detected Budget</span>
                          <p className="font-semibold text-lg text-primary">{doc.budget}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Timeline</span>
                          <p className="font-semibold text-lg">{doc.timeline}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-xs text-muted-foreground block mb-2">Extracted Services Needed</span>
                        <div className="flex flex-wrap gap-2">
                          {doc.services?.map((service, i) => (
                            <Badge key={i} variant="secondary" className="font-normal">{service}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700">
                        {doc.extractedLeads ? `Auto-added ${doc.extractedLeads.length} leads to Pipeline` : "Auto-added to Pipeline"}
                      </span>
                    </div>
                    <Button variant="link" className="text-indigo-600 h-auto p-0">View {doc.extractedLeads ? "Leads" : "Lead"}</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
