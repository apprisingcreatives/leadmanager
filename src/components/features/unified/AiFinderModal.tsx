"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, Loader2, CheckCircle2 } from "lucide-react";
import { useLeads } from "@/lib/context/LeadsContext";
import { searchApollo } from "@/app/actions/apollo";

export function AiFinderModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addLead } = useLeads();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSearch = () => {
    if (!query) return;
    setIsSearching(true);
    setSuccessMessage("");
    
    // Simulate AI Discovery Search since Apollo is disabled
    setTimeout(() => {
      setResults([
        { name: "Jessica Barnes", company: "NextGen Software", industry: "Technology", score: 96, val: 20000 },
        { name: "Michael Vance", company: "Vance Legal Partners", industry: "Legal", score: 92, val: 15000 },
        { name: "Sarah Lin", company: "Apex Real Estate", industry: "Real Estate", score: 88, val: 12000 }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const handleAddResult = (result: any) => {
    addLead({
      id: Math.random().toString(36).substring(7),
      name: result.name,
      companyName: result.company,
      industry: result.industry,
      value: result.val,
      aiScore: result.score,
      status: 'Discovered'
    });
    
    setSuccessMessage(`Added ${result.name} to Pipeline!`);
    setResults(results.filter(r => r.name !== result.name));
    
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Brain className="w-5 h-5 text-indigo-500"/> AI Lead Finder</DialogTitle>
          <DialogDescription>Describe your ideal customer and AI will scrape public sources to find matches.</DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
               <Input 
                 placeholder="e.g. Dental clinics in New York expanding operations" 
                 className="pl-9"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
               />
            </div>
            <Button onClick={handleSearch} disabled={!query || isSearching} className="bg-indigo-600 hover:bg-indigo-700">
               {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Find Leads"}
            </Button>
          </div>
          
          {successMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center justify-center gap-2 text-sm font-medium animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4" /> {successMessage}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Discovered Prospects</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                 {results.map((r, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                       <div>
                         <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                           {r.name}
                           <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">{r.score} Match</span>
                         </div>
                         <div className="text-xs text-slate-500 mt-1">{r.company} • {r.industry}</div>
                       </div>
                       <Button size="sm" variant="outline" onClick={() => handleAddResult(r)} className="text-xs">Add</Button>
                    </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
