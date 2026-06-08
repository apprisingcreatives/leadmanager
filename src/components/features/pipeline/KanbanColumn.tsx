"use client";

import { Droppable } from "@hello-pangea/dnd";
import { KanbanCard } from "./KanbanCard";
import { Lead, PipelineStage } from "@/lib/data/mock-pipeline";

interface KanbanColumnProps {
  id: PipelineStage;
  title: string;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export function KanbanColumn({ id, title, leads, onLeadClick }: KanbanColumnProps) {
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <div className="flex flex-col flex-shrink-0 w-80 max-h-full bg-muted/30 rounded-xl overflow-hidden border">
      <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm font-outfit">{title}</h3>
          <span className="flex items-center justify-center bg-background text-xs font-medium w-5 h-5 rounded-full border">
            {leads.length}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          ${totalValue.toLocaleString()}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto p-3 min-h-[150px] transition-colors ${
              snapshot.isDraggingOver ? "bg-accent/50" : ""
            }`}
          >
            {leads.map((lead, index) => (
              <KanbanCard key={lead.id} lead={lead} index={index} onClick={() => onLeadClick(lead)} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
