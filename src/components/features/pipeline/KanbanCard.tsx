"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Lead } from "@/lib/data/mock-pipeline";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Building2, Trash2 } from "lucide-react";
import { useLeads } from "@/lib/context/LeadsContext";

interface KanbanCardProps {
  lead: Lead;
  index: number;
  onClick: () => void;
}

export function KanbanCard({ lead, index, onClick }: KanbanCardProps) {
  const { deleteLead } = useLeads();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteLead(lead.id);
    }
  };

  return (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 select-none ${snapshot.isDragging ? "opacity-90" : "opacity-100"}`}
          style={provided.draggableProps.style}
        >
          <div onClick={onClick} className="cursor-pointer">
            <Card className={`border shadow-sm transition-all hover:border-indigo-400 hover:shadow-md ${snapshot.isDragging ? "ring-2 ring-indigo-500 shadow-lg" : ""}`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-sm leading-tight pr-2">{lead.name}</div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={handleDelete} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1 rounded-md transition-colors" title="Delete Lead">
                     <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Badge variant={lead.aiScore > 80 ? "default" : "secondary"} className="text-[10px] px-1.5 py-0">
                    {lead.aiScore}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mb-3">
                <Building2 className="w-3 h-3 mr-1" />
                <span className="truncate">{lead.companyName}</span>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t">
                <Badge variant="outline" className="text-[10px] font-normal border-muted-foreground/30">
                  {lead.industry}
                </Badge>
                <div className="flex items-center text-xs font-semibold text-primary">
                  <DollarSign className="w-3 h-3" />
                  {lead.value.toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      )}
    </Draggable>
  );
}
