export type PipelineStage = 'Discovered' | 'Researching' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation';

export interface CallLog {
  id: string;
  timestamp: string;
  text: string;
}

export interface Lead {
  id: string;
  name: string;
  companyName: string;
  industry: string;
  value: number;
  aiScore: number;
  status: PipelineStage;
  email?: string;
  phone?: string;
  socialMedia?: string;
  notes?: CallLog[];
}

export const initialPipelineData: Record<PipelineStage, Lead[]> = {
  'Discovered': [
    { id: 'lead-1', name: 'John Smith', companyName: 'Dr. Smith Dental', industry: 'Healthcare', value: 4500, aiScore: 85, status: 'Discovered' },
    { id: 'lead-2', name: 'Sarah Jones', companyName: 'BuildIt Construction', industry: 'Construction', value: 12000, aiScore: 72, status: 'Discovered' },
  ],
  'Researching': [
    { id: 'lead-3', name: 'Mike Johnson', companyName: 'TechNova Solutions', industry: 'Software', value: 15000, aiScore: 92, status: 'Researching' },
  ],
  'Contacted': [
    { id: 'lead-4', name: 'Emily Davis', companyName: 'Elite Accounting', industry: 'Finance', value: 8000, aiScore: 68, status: 'Contacted' },
  ],
  'Qualified': [
    { id: 'lead-5', name: 'Robert Wilson', companyName: 'Acme Logistics', industry: 'Transportation', value: 25000, aiScore: 95, status: 'Qualified' },
  ],
  'Proposal': [],
  'Negotiation': []
};
