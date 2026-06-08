"use client";

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "./KanbanColumn";
import { LeadDetailsModal } from "./LeadDetailsModal";
import { PipelineStage, Lead } from "@/lib/data/mock-pipeline";
import { useLeads } from "@/lib/context/LeadsContext";

const STAGES: PipelineStage[] = [
  "Discovered",
  "Researching",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
];

export function KanbanBoard({ searchQuery = "" }: { searchQuery?: string }) {
  const { pipelineData, updatePipelineData } = useLeads();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">Loading Pipeline...</div>;
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumnId = source.droppableId as PipelineStage;
    const destColumnId = destination.droppableId as PipelineStage;

    const sourceColumn = [...pipelineData[sourceColumnId]];
    const destColumn = sourceColumnId === destColumnId ? sourceColumn : [...pipelineData[destColumnId]];

    const [movedItem] = sourceColumn.splice(source.index, 1);
    
    // Update the item's status
    movedItem.status = destColumnId;

    destColumn.splice(destination.index, 0, movedItem);

    updatePipelineData({
      ...pipelineData,
      [sourceColumnId]: sourceColumn,
      [destColumnId]: destColumn,
    });
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-4 overflow-x-auto pb-4 pt-2">
          {STAGES.map((stage) => {
            let stageLeads = pipelineData[stage];
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              stageLeads = stageLeads.filter(l => 
                l.name.toLowerCase().includes(q) || 
                (l.companyName && l.companyName.toLowerCase().includes(q)) ||
                (l.email && l.email.toLowerCase().includes(q)) ||
                (l.phone && l.phone.toLowerCase().includes(q))
              );
            }
            return (
              <KanbanColumn 
                key={stage} 
                id={stage} 
                title={stage} 
                leads={stageLeads} 
                onLeadClick={setSelectedLead}
              />
            );
          })}
        </div>
      </DragDropContext>
      
      <LeadDetailsModal 
        lead={selectedLead} 
        open={selectedLead !== null} 
        onOpenChange={(open) => !open && setSelectedLead(null)} 
      />
    </>
  );
}
