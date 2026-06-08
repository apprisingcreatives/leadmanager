import { KanbanBoard } from "@/components/features/pipeline/KanbanBoard";

export default function PipelinePage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-outfit text-3xl font-bold tracking-tight">Sales Pipeline</h2>
          <p className="text-muted-foreground">Manage leads and track opportunities through your sales process.</p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
