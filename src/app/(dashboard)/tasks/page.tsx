import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockTasks = [
  { id: 1, title: "Prepare proposal for TechNova", lead: "Mike Johnson", dueDate: "Today", priority: "High", type: "Proposal" },
  { id: 2, title: "Follow up call regarding budget", lead: "Sarah Jones", dueDate: "Tomorrow", priority: "Medium", type: "Call" },
  { id: 3, title: "Send contract draft", lead: "Robert Wilson", dueDate: "Next Week", priority: "High", type: "Email" },
  { id: 4, title: "Initial discovery meeting", lead: "Emily Davis", dueDate: "Jun 12", priority: "Low", type: "Meeting" },
];

export default function TasksPage() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-outfit text-3xl font-bold tracking-tight">Tasks & Follow-ups</h2>
          <p className="text-muted-foreground">Stay on top of your sales activities.</p>
        </div>
        <Button>Create Task</Button>
      </div>

      <div className="grid gap-4 max-w-4xl">
        {mockTasks.map((task) => (
          <Card key={task.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center justify-center w-6 h-6 rounded-md border border-muted-foreground/30 text-transparent hover:text-primary cursor-pointer transition-colors">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-base">{task.title}</h4>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.dueDate}</span>
                  <span>•</span>
                  <span>Lead: <strong className="text-foreground font-medium">{task.lead}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={task.priority === "High" ? "destructive" : "secondary"} className="text-xs">
                  {task.priority}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {task.type}
                </Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
