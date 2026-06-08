"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { useLeads } from "@/lib/context/LeadsContext";
import { uploadDocument } from "@/app/actions/documents";

export function UploadPdfModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addLead } = useLeads();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadDocument(formData);
      
      if (result.status === "completed") {
        let addedCount = 0;
        if (result.extractedLeads && result.extractedLeads.length > 0) {
           result.extractedLeads.forEach(lead => {
             addLead({
               id: Math.random().toString(36).substring(7),
               name: lead.name,
               companyName: lead.company,
               industry: lead.industry,
               value: parseInt(lead.budget?.replace(/[^0-9]/g, '').slice(0, 5) || "10000"),
               aiScore: Math.floor(Math.random() * 20) + 75,
               status: 'Discovered',
               address: lead.address || undefined,
               clinicHours: lead.clinic_hours || undefined,
               phone: lead.tel || undefined,
               fax: lead.fax || undefined
             });
           });
           addedCount = result.extractedLeads.length;
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
          addedCount = 1;
        }
        setSuccessMessage(`Successfully extracted ${addedCount} lead${addedCount > 1 ? 's' : ''} to your board!`);
        setTimeout(() => {
          setSuccessMessage("");
          onOpenChange(false);
        }, 2000);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Error uploading file. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={(openState) => { if(!isProcessing) onOpenChange(openState); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UploadCloud className="w-5 h-5 text-indigo-500"/> Upload Document</DialogTitle>
          <DialogDescription>Upload an RFP, client brief, or clinic list (e.g. Intellicare). AI will extract leads and drop them onto your board.</DialogDescription>
        </DialogHeader>
        
        {successMessage ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
             <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-in zoom-in" />
             <h3 className="text-xl font-bold text-emerald-700">{successMessage}</h3>
          </div>
        ) : (
          <div 
            className={`mt-4 border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400"
            } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />
            {isProcessing ? (
               <div className="flex flex-col items-center">
                 <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
                 <p className="font-medium text-slate-700">AI is reading document...</p>
                 <p className="text-sm text-slate-500 mt-1">Extracting leads to your board</p>
               </div>
            ) : (
               <>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Drag & Drop PDF Here</h3>
                <p className="text-sm text-slate-500 mb-4">Up to 50MB</p>
                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Select File</Button>
               </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
