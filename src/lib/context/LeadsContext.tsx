"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { initialPipelineData, PipelineStage, Lead } from "@/lib/data/mock-pipeline";
import { createClient } from "@/lib/supabase/client";

interface LeadsContextType {
  pipelineData: Record<PipelineStage, Lead[]>;
  updatePipelineData: (newData: Record<PipelineStage, Lead[]>) => void;
  getAllLeads: () => Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  isSupabaseConnected: boolean;
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [pipelineData, setPipelineData] = useState<Record<PipelineStage, Lead[]>>(initialPipelineData);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check if Supabase keys exist
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase keys missing. Falling back to local mock data.");
      return;
    }

    const supabase = createClient();
    setIsSupabaseConnected(true);

    async function fetchLeads() {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching leads:", error);
        return;
      }

      if (data && data.length > 0) {
        // Group by status
        const newData = {
          'Discovered': [],
          'Researching': [],
          'Contacted': [],
          'Qualified': [],
          'Proposal': [],
          'Negotiation': []
        } as Record<PipelineStage, Lead[]>;

        data.forEach(dbLead => {
          let parsedNotes = [];
          if (Array.isArray(dbLead.notes)) {
            parsedNotes = dbLead.notes;
          } else if (typeof dbLead.notes === 'string' && dbLead.notes.trim() !== '') {
            try { parsedNotes = JSON.parse(dbLead.notes); } catch(e) { console.error("Failed to parse notes", e); }
          }

          const lead: Lead = {
            id: dbLead.id,
            name: dbLead.name,
            companyName: dbLead.company_name,
            industry: dbLead.industry,
            value: dbLead.value,
            aiScore: dbLead.ai_score,
            status: dbLead.status as PipelineStage,
            email: dbLead.email,
            phone: dbLead.phone,
            socialMedia: dbLead.social_media,
            address: dbLead.address,
            clinicHours: dbLead.clinic_hours,
            fax: dbLead.fax,
            notes: Array.isArray(dbLead.notes) ? dbLead.notes : (parsedNotes || [])
          };
          if (newData[lead.status]) {
            newData[lead.status].push(lead);
          }
        });
        setPipelineData(newData);
      } else {
        // Clear if DB is empty but connected
        setPipelineData({
          'Discovered': [],
          'Researching': [],
          'Contacted': [],
          'Qualified': [],
          'Proposal': [],
          'Negotiation': []
        });
      }
    }

    fetchLeads();
  }, []);

  const updatePipelineData = (newData: Record<PipelineStage, Lead[]>) => {
    setPipelineData(newData);
  };

  const getAllLeads = () => {
    return Object.values(pipelineData).flat();
  };

  const addLead = async (lead: Lead) => {
    // Check for duplicates first
    const allLeadsList = Object.values(pipelineData).flat();
    const duplicate = allLeadsList.find(l => 
      l.name.toLowerCase() === lead.name.toLowerCase() || 
      (l.companyName && lead.companyName && l.companyName.toLowerCase() === lead.companyName.toLowerCase())
    );

    if (duplicate) {
      let updated = false;
      let newEmail = duplicate.email;
      let newPhone = duplicate.phone;

      if (lead.email && (!duplicate.email || !duplicate.email.includes(lead.email))) {
        newEmail = duplicate.email ? `${duplicate.email}, ${lead.email}` : lead.email;
        updated = true;
      }
      if (lead.phone && (!duplicate.phone || !duplicate.phone.includes(lead.phone))) {
        newPhone = duplicate.phone ? `${duplicate.phone}, ${lead.phone}` : lead.phone;
        updated = true;
      }

      if (updated) {
        updateLead({ ...duplicate, email: newEmail, phone: newPhone });
      }
      return;
    }

    // Update local state instantly (Optimistic UI)
    setPipelineData((prev) => ({
      ...prev,
      [lead.status]: [lead, ...prev[lead.status]],
    }));

    if (isSupabaseConnected) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('leads').insert({
        user_id: user.id,
        name: lead.name,
        company_name: lead.companyName,
        industry: lead.industry,
        value: lead.value,
        ai_score: lead.aiScore,
        status: lead.status,
        email: lead.email,
        phone: lead.phone,
        social_media: lead.socialMedia,
        address: lead.address,
        clinic_hours: lead.clinicHours,
        fax: lead.fax,
        notes: lead.notes
      });
    }
  };

  const updateLead = async (updatedLead: Lead) => {
    // Optimistic UI update
    setPipelineData((prev) => {
      const newData = { ...prev };
      (Object.keys(newData) as PipelineStage[]).forEach(stage => {
        newData[stage] = newData[stage].filter(l => l.id !== updatedLead.id);
      });
      newData[updatedLead.status] = [updatedLead, ...newData[updatedLead.status]];
      return newData;
    });

    if (isSupabaseConnected) {
      const supabase = createClient();
      await supabase.from('leads').update({
        name: updatedLead.name,
        company_name: updatedLead.companyName,
        industry: updatedLead.industry,
        value: updatedLead.value,
        ai_score: updatedLead.aiScore,
        status: updatedLead.status,
        email: updatedLead.email,
        phone: updatedLead.phone,
        social_media: updatedLead.socialMedia,
        address: updatedLead.address,
        clinic_hours: updatedLead.clinicHours,
        fax: updatedLead.fax,
        notes: updatedLead.notes
      }).eq('id', updatedLead.id);
    }
  };

  const deleteLead = async (id: string) => {
    // Optimistic UI update
    setPipelineData((prev) => {
      const newData = { ...prev };
      (Object.keys(newData) as PipelineStage[]).forEach(stage => {
        newData[stage] = newData[stage].filter(l => l.id !== id);
      });
      return newData;
    });

    if (isSupabaseConnected) {
      const supabase = createClient();
      await supabase.from('leads').delete().eq('id', id);
    }
  };

  return (
    <LeadsContext.Provider value={{ pipelineData, updatePipelineData, getAllLeads, addLead, updateLead, deleteLead, isSupabaseConnected }}>
      {children}
    </LeadsContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadsContext);
  if (context === undefined) {
    throw new Error("useLeads must be used within a LeadsProvider");
  }
  return context;
}
