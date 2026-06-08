"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Mail, Plus, Building2, ChevronDown, ListTodo, Phone, Globe, Clock, Brain, UserPlus } from "lucide-react";
import { useLeads } from "@/lib/context/LeadsContext";
import { PipelineStage, Lead } from "@/lib/data/mock-pipeline";

export default function LeadsSearchPage() {
  const { getAllLeads, pipelineData, updatePipelineData } = useLeads();
  const leads = getAllLeads();
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<Lead | null>(null);

  // Manual Add Lead State
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    companyName: "",
    industry: "",
    value: "10000"
  });

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleAddToPipeline = () => {
    if (selectedIds.size === 0) return;
    
    const newData = { ...pipelineData };
    const selectedLeads: Lead[] = [];
    
    // Remove from current stages
    Object.keys(newData).forEach((stage) => {
      const stageKey = stage as PipelineStage;
      newData[stageKey] = newData[stageKey].filter((lead) => {
        if (selectedIds.has(lead.id)) {
          selectedLeads.push({ ...lead, status: 'Discovered' });
          return false;
        }
        return true;
      });
    });

    // Add to Discovered
    newData['Discovered'] = [...newData['Discovered'], ...selectedLeads];
    
    updatePipelineData(newData);
    setSelectedIds(new Set()); // clear selection
  };

  const handleManualAddLead = () => {
    if (!newLeadForm.name) return;
    
    addLead({
      id: Math.random().toString(36).substring(7),
      name: newLeadForm.name,
      companyName: newLeadForm.companyName || "Unknown",
      industry: newLeadForm.industry || "General",
      value: parseInt(newLeadForm.value) || 10000,
      aiScore: 0, // 0 for manual
      status: 'Researching' // default starting stage
    });
    
    setIsAddLeadOpen(false);
    setNewLeadForm({ name: "", companyName: "", industry: "", value: "10000" });
  };

  return (
    <div className="flex h-full gap-6">
      {/* Left Filter Panel - Apollo Style */}
      <div className="w-64 shrink-0 flex flex-col gap-4 border-r border-border pr-4 overflow-y-auto hidden md:flex">
        <div className="font-semibold text-sm mb-2 text-foreground uppercase tracking-wider">Filters</div>
        
        {/* Mock Filter Sections */}
        {['Lists & Personas', 'Job Titles', 'Company', 'Location', 'Employees', 'Industry', 'Keywords', 'Technologies'].map((filter) => (
          <div key={filter} className="border-b border-border pb-3">
            <button className="flex items-center justify-between w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {filter}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Data Table Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between mb-4 bg-card border border-border rounded-lg p-2 shadow-sm">
          <div className="flex items-center gap-3 px-2">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : `${leads.length} Total`}
            </span>
            {selectedIds.size > 0 && (
              <>
                <div className="w-px h-4 bg-border mx-1" />
                <Button size="sm" variant="default" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <ListTodo className="w-4 h-4" /> Add to Sequence
                </Button>
                <Button size="sm" variant="secondary" onClick={handleAddToPipeline} className="h-8 gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800">
                  <Plus className="w-4 h-4" /> Add to Pipeline
                </Button>
                <Button size="sm" variant="outline" className="h-8 gap-2 border-slate-200 text-slate-700 hover:bg-slate-50">
                  <Mail className="w-4 h-4" /> Email
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search people..." className="pl-8 h-8 w-64 text-sm bg-background border-border" />
            </div>
            <Button size="sm" variant="outline" className="h-8 bg-card border-border hidden lg:flex">
              <Filter className="w-4 h-4 mr-2" /> More Filters
            </Button>
            
            {/* Manual Add Lead Dialog */}
            <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
              <DialogTrigger render={<Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 ml-2"><UserPlus className="w-4 h-4"/> Add Lead</Button>} />
              <DialogContent className="sm:max-w-[425px] bg-card border border-border">
                <DialogHeader>
                  <DialogTitle>Add New Contact</DialogTitle>
                  <DialogDescription>Manually enter a prospect into your database.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                    <Input id="name" value={newLeadForm.name} onChange={(e) => setNewLeadForm({...newLeadForm, name: e.target.value})} placeholder="e.g. Jane Doe" className="border-border" />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="company" className="text-sm font-medium text-slate-700">Company</label>
                    <Input id="company" value={newLeadForm.companyName} onChange={(e) => setNewLeadForm({...newLeadForm, companyName: e.target.value})} placeholder="e.g. Acme Corp" className="border-border" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <label htmlFor="industry" className="text-sm font-medium text-slate-700">Industry</label>
                      <Input id="industry" value={newLeadForm.industry} onChange={(e) => setNewLeadForm({...newLeadForm, industry: e.target.value})} placeholder="e.g. SaaS" className="border-border" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="value" className="text-sm font-medium text-slate-700">Est. Value ($)</label>
                      <Input id="value" type="number" value={newLeadForm.value} onChange={(e) => setNewLeadForm({...newLeadForm, value: e.target.value})} placeholder="10000" className="border-border" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                  <Button onClick={handleManualAddLead} className="bg-indigo-600 text-white hover:bg-indigo-700">Save Lead</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-lg border border-border bg-card flex-1 overflow-auto shadow-sm relative">
          <Table>
            <TableHeader className="bg-slate-50 sticky top-0 z-10 border-b border-border shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 pl-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-border"
                    checked={selectedIds.size === leads.length && leads.length > 0}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Name</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Title & Company</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Industry</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">Status</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500">AI Score</TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wider text-slate-500 text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  onClick={() => setSelectedLeadForDetails(lead)}
                  className={`group cursor-pointer border-b border-border transition-colors ${selectedIds.has(lead.id) ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50/50'}`}
                >
                  <TableCell className="pl-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                      checked={selectedIds.has(lead.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(lead.id);
                      }}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="font-semibold text-slate-900 text-sm flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                        {lead.name.charAt(0)}
                      </div>
                      {lead.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {lead.companyName}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Decision Maker</div>
                  </TableCell>
                  <TableCell className="py-3 text-sm text-slate-600">{lead.industry}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border-slate-200">
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${lead.aiScore >= 90 ? 'bg-emerald-500' : lead.aiScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      <span className="text-sm font-semibold text-slate-700">{lead.aiScore}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={(e) => { e.stopPropagation(); }}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={(e) => { e.stopPropagation(); }}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>

      {/* Slide-out Lead Details Panel */}
      <Sheet open={!!selectedLeadForDetails} onOpenChange={(open) => !open && setSelectedLeadForDetails(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto border-l border-border bg-card p-0">
          {selectedLeadForDetails && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-border bg-slate-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-sm">
                      {selectedLeadForDetails.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selectedLeadForDetails.name}</h2>
                      <p className="text-slate-600 flex items-center gap-2 font-medium">
                        <Building2 className="w-4 h-4" /> {selectedLeadForDetails.companyName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700"><Mail className="w-4 h-4"/> Email</Button>
                  <Button variant="outline" className="flex-1 gap-2 border-slate-300"><Phone className="w-4 h-4"/> Call</Button>
                  <Button variant="outline" size="icon" className="border-slate-300"><Globe className="w-4 h-4 text-slate-600"/></Button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-8 flex-1 bg-white">
                
                {/* AI Insights */}
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-indigo-900 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-600" /> AI Intelligence Match
                    </h3>
                    <Badge className="bg-emerald-100 text-emerald-700 border-none">{selectedLeadForDetails.aiScore} Score</Badge>
                  </div>
                  <p className="text-sm text-indigo-800 leading-relaxed">
                    This lead matches your Ideal Customer Profile. They are a mid-sized {selectedLeadForDetails.industry} company showing signals for needing immediate software solutions. Est. Value: <strong className="text-emerald-700">${selectedLeadForDetails.value.toLocaleString()}</strong>.
                  </p>
                </div>

                {/* Info Grid */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-500 mb-1">Email</div>
                      <div className="font-medium text-slate-900">{selectedLeadForDetails.name.split(' ')[0].toLowerCase()}@{selectedLeadForDetails.companyName.split(' ')[0].toLowerCase()}.com</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Phone</div>
                      <div className="font-medium text-slate-900">+1 (555) 019-2834</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Location</div>
                      <div className="font-medium text-slate-900">San Francisco, CA</div>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-1">Pipeline Stage</div>
                      <Badge variant="secondary" className="font-semibold">{selectedLeadForDetails.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Activity Feed Stub */}
                <div>
                  <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">Recent Activity</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 text-slate-500 shadow shrink-0 z-10">
                        <ListTodo className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm ml-4">
                        <div className="flex items-center justify-between space-x-2 mb-1">
                          <div className="font-bold text-slate-900 text-sm">Added to Pipeline</div>
                          <time className="text-xs font-medium text-indigo-500">Just now</time>
                        </div>
                        <div className="text-slate-500 text-sm">Moved to {selectedLeadForDetails.status} stage.</div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>

    </div>
  );
}
