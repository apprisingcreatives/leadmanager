"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Building2, DollarSign, Brain, Mail, Phone, Clock, FileText, Link as LinkIcon, Edit2, Save, X } from "lucide-react";
import { Lead, PipelineStage } from "@/lib/data/mock-pipeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeads } from "@/lib/context/LeadsContext";

interface LeadDetailsModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailsModal({ lead, open, onOpenChange }: LeadDetailsModalProps) {
  const { updateLead } = useLeads();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (lead) {
      setEditedLead(lead);
      setNewNote("");
    }
    setIsEditing(false);
  }, [lead, open]);

  if (!lead || !editedLead) return null;

  const handleSave = () => {
    updateLead(editedLead);
    setIsEditing(false);
  };

  const handleSaveNote = () => {
    if (!editedLead || !newNote.trim()) return;
    
    const newLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      text: newNote.trim()
    };
    
    const updatedNotes = [newLog, ...(editedLead.notes || [])];
    const updated = { ...editedLead, notes: updatedNotes };
    
    setEditedLead(updated);
    updateLead(updated);
    setNewNote("");
  };

  const handleCancel = () => {
    setEditedLead(lead);
    setIsEditing(false);
  };

  const displayEmail = editedLead.email || `${editedLead.name.split(" ")[0].toLowerCase()}@${editedLead.companyName.replace(/[^a-zA-Z]/g, "").toLowerCase() || "company"}.com.ph`;
  const displayPhone = editedLead.phone || `+63 917 800 ${editedLead.id.charCodeAt(0).toString().slice(-2).padStart(2, '0')}${editedLead.id.charCodeAt(1)?.toString().slice(-2).padStart(2, '0') || '00'}`;
  const rawPhone = editedLead.phone ? editedLead.phone.replace(/[^0-9+]/g, '') : displayPhone.replace(/[^0-9+]/g, '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95vw] md:w-[90vw] overflow-hidden p-0 gap-0 border border-slate-200 bg-white rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row h-full max-h-[85vh]">
          
          {/* Left Column: Lead Info */}
          <div className="w-full md:w-1/2 p-6 bg-white flex flex-col gap-6 overflow-y-auto border-r border-slate-100 relative">
            
            <div className="absolute top-4 right-8 flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel} className="h-8 px-2 text-slate-500"><X className="w-4 h-4 mr-1"/> Cancel</Button>
                  <Button size="sm" onClick={handleSave} className="h-8 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"><Save className="w-4 h-4 mr-1"/> Save</Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-2 text-slate-600"><Edit2 className="w-4 h-4 mr-1"/> Edit</Button>
              )}
            </div>

            <DialogHeader className="text-left space-y-2 mt-2">
              <div className="flex flex-wrap items-center gap-3 pr-16">
                {isEditing ? (
                  <Input value={editedLead.name} onChange={e => setEditedLead({...editedLead, name: e.target.value})} className="text-2xl font-bold h-10 w-full" />
                ) : (
                  <DialogTitle className="text-3xl font-bold font-outfit text-slate-900 leading-tight">{editedLead.name}</DialogTitle>
                )}
                {!isEditing && <Badge variant={editedLead.aiScore > 80 ? "default" : "secondary"} className="shadow-sm">AI Score: {editedLead.aiScore}</Badge>}
              </div>
              <DialogDescription className="flex items-center gap-2 text-base text-slate-600 mt-2">
                <Building2 className="w-4 h-4 shrink-0" /> 
                {isEditing ? (
                  <div className="flex gap-2 w-full pr-8">
                    <Input value={editedLead.companyName} onChange={e => setEditedLead({...editedLead, companyName: e.target.value})} className="h-8" placeholder="Company" />
                    <Input value={editedLead.industry} onChange={e => setEditedLead({...editedLead, industry: e.target.value})} className="h-8" placeholder="Industry" />
                  </div>
                ) : (
                  <>{editedLead.companyName} • {editedLead.industry}</>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block mb-1">Deal Value</span>
                <div className="flex items-center text-xl font-bold text-slate-900">
                  <DollarSign className="w-5 h-5 text-emerald-500 mr-1" />
                  {isEditing ? (
                    <Input type="number" value={editedLead.value} onChange={e => setEditedLead({...editedLead, value: parseInt(e.target.value) || 0})} className="h-8 w-full" />
                  ) : (
                    editedLead.value.toLocaleString()
                  )}
                </div>
              </div>
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500 font-medium block mb-1">Current Status</span>
                {isEditing ? (
                  <select 
                    value={editedLead.status}
                    onChange={e => setEditedLead({...editedLead, status: e.target.value as PipelineStage})}
                    className="h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                  >
                    {['Discovered', 'Researching', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                ) : (
                  <Badge variant="outline" className="font-semibold text-indigo-600 border-indigo-200 bg-indigo-50/80">
                    {editedLead.status}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2 border-b pb-2 text-slate-800"><FileText className="w-4 h-4 text-slate-500" /> Contact Info</h4>
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <Input value={editedLead.email || ""} onChange={e => setEditedLead({...editedLead, email: e.target.value})} placeholder="Email Address" className="h-9" />
                    <Input value={editedLead.phone || ""} onChange={e => setEditedLead({...editedLead, phone: e.target.value})} placeholder="Phone Number" className="h-9" />
                    <Input value={editedLead.socialMedia || ""} onChange={e => setEditedLead({...editedLead, socialMedia: e.target.value})} placeholder="Social Media Link" className="h-9" />
                  </>
                ) : (
                  <>
                    <a href={`mailto:${displayEmail}`} className="flex items-center gap-3 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/80 hover:text-indigo-700 transition-colors shadow-sm cursor-pointer group">
                      <Mail className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      {displayEmail}
                    </a>
                    <a href={`tel:${rawPhone}`} className="flex items-center gap-3 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/80 hover:text-indigo-700 transition-colors shadow-sm cursor-pointer group">
                      <Phone className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      {displayPhone}
                    </a>
                    {editedLead.socialMedia && (
                      <a href={editedLead.socialMedia.startsWith('http') ? editedLead.socialMedia : `https://${editedLead.socialMedia}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/80 hover:text-indigo-700 transition-colors shadow-sm cursor-pointer group">
                        <LinkIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                        {editedLead.socialMedia}
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <h4 className="text-sm font-semibold flex items-center gap-2 border-b pb-2 text-slate-800"><Brain className="w-4 h-4 text-pink-500" /> AI Insights</h4>
              <div className="text-sm text-slate-700 leading-relaxed bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100/50 shadow-sm">
                This prospect is a strong match for your services. Based on the industry ({editedLead.industry}) and company size, they likely have immediate needs that align with Mediflow's core offerings.
              </div>
            </div>
          </div>

          {/* Right Column: Calling & Notes */}
          <div className="w-full md:w-1/2 p-6 bg-slate-50/50 flex flex-col gap-6 overflow-y-auto">
            <div className="flex-1 flex flex-col space-y-3 h-full">
              <h4 className="text-sm font-semibold flex items-center gap-2 text-slate-800"><Phone className="w-4 h-4 text-emerald-500" /> Call Workspace</h4>
              
              {/* Note Input */}
              <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <textarea 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full min-h-[80px] p-2 text-sm rounded-lg border-transparent focus:ring-0 focus:border-transparent focus:outline-none resize-none text-slate-700 bg-transparent" 
                  placeholder="Log a new interaction..."
                />
                <div className="flex justify-end border-t border-slate-100 pt-2">
                   <Button 
                      onClick={handleSaveNote} 
                      disabled={!newNote.trim()} 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-8 px-4 rounded-lg font-medium transition-all"
                   >
                      <Save className="w-4 h-4 mr-2" /> Save Note
                   </Button>
                </div>
              </div>

              {/* Log History */}
              <div className="flex-1 overflow-y-auto space-y-3 mt-4 pr-2">
                <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Interaction History</h5>
                {(!editedLead.notes || editedLead.notes.length === 0) ? (
                  <div className="text-center p-6 text-sm text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                    No notes recorded yet.
                  </div>
                ) : (
                  editedLead.notes.map((note) => (
                    <div key={note.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                      <div className="text-xs text-slate-400 font-medium mb-1.5 flex items-center gap-1.5">
                         <Clock className="w-3 h-3" />
                         {new Date(note.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.text}</p>
                    </div>
                  ))
                )}
              </div>

            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 mt-auto shrink-0 border-t border-slate-200 pt-4">
              <Button onClick={() => window.location.href = `mailto:${displayEmail}`} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm py-6 rounded-xl cursor-pointer">
                <Mail className="w-5 h-5 mr-2" /> Send Email
              </Button>
              <Button variant="outline" className="flex-1 bg-white hover:bg-slate-50 shadow-sm border-slate-200 py-6 rounded-xl">
                <Clock className="w-5 h-5 mr-2" /> Schedule Meeting
              </Button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
