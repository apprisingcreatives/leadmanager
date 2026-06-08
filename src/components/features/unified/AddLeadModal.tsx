"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useLeads } from "@/lib/context/LeadsContext";

export function AddLeadModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { addLead } = useLeads();
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    companyName: "",
    industry: "",
    value: "10000",
    email: "",
    phone: "",
    socialMedia: ""
  });

  const handleManualAddLead = () => {
    if (!newLeadForm.name) return;
    
    addLead({
      id: Math.random().toString(36).substring(7),
      name: newLeadForm.name,
      companyName: newLeadForm.companyName || "Unknown",
      industry: newLeadForm.industry || "General",
      value: parseInt(newLeadForm.value) || 10000,
      aiScore: 0,
      status: 'Researching',
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      socialMedia: newLeadForm.socialMedia
    });
    
    onOpenChange(false);
    setNewLeadForm({ name: "", companyName: "", industry: "", value: "10000", email: "", phone: "", socialMedia: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-indigo-500"/> Add New Lead</DialogTitle>
          <DialogDescription>Manually enter a prospect to drop them onto your Kanban board.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input id="name" value={newLeadForm.name} onChange={(e) => setNewLeadForm({...newLeadForm, name: e.target.value})} placeholder="e.g. Jane Doe" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="company" className="text-sm font-medium">Company</label>
            <Input id="company" value={newLeadForm.companyName} onChange={(e) => setNewLeadForm({...newLeadForm, companyName: e.target.value})} placeholder="e.g. Acme Corp" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="industry" className="text-sm font-medium">Industry</label>
              <Input id="industry" value={newLeadForm.industry} onChange={(e) => setNewLeadForm({...newLeadForm, industry: e.target.value})} placeholder="e.g. SaaS" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="value" className="text-sm font-medium">Est. Value ($)</label>
              <Input id="value" type="number" value={newLeadForm.value} onChange={(e) => setNewLeadForm({...newLeadForm, value: e.target.value})} placeholder="10000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">Email (Optional)</label>
              <Input id="email" type="email" value={newLeadForm.email} onChange={(e) => setNewLeadForm({...newLeadForm, email: e.target.value})} placeholder="jane@example.com" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone (Optional)</label>
              <Input id="phone" type="tel" value={newLeadForm.phone} onChange={(e) => setNewLeadForm({...newLeadForm, phone: e.target.value})} placeholder="+63 917..." />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="social" className="text-sm font-medium">LinkedIn / Social (Optional)</label>
            <Input id="social" value={newLeadForm.socialMedia} onChange={(e) => setNewLeadForm({...newLeadForm, socialMedia: e.target.value})} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleManualAddLead} className="bg-indigo-600 text-white hover:bg-indigo-700">Add to Board</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
