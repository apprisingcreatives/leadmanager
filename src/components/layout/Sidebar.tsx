"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Building2, Brain, FileText, CheckSquare, Settings, Kanban, Search, ListTodo } from "lucide-react";
import { SalesAssistant } from "@/components/features/ai/SalesAssistant";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Search", href: "/leads", icon: Search, color: "text-blue-500" },
  { name: "Sequences", href: "/sequences", icon: ListTodo, color: "text-teal-500" },
  { name: "Pipeline", href: "/pipeline", icon: Kanban, color: "text-emerald-500" },
  { name: "Companies", href: "/companies", icon: Building2, color: "text-amber-500" },
  { name: "AI Discovery", href: "/intelligence", icon: Brain, color: "text-blue-400" },
  { name: "Documents", href: "/documents", icon: FileText, color: "text-cyan-500" },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, color: "text-rose-500" },
  { name: "Settings", href: "/settings", icon: Settings, color: "text-slate-500" },
];

export function SidebarContent() {
  const pathname = usePathname();
  
  return (
    <>
      <div className="mb-8 flex items-center px-2 pt-2 md:pt-0">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
          Apprising
        </h1>
      </div>
      <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-2 pb-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive 
                  ? "bg-gradient-to-r from-blue-100 to-teal-50 text-blue-900 shadow-sm border border-blue-200/50" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <item.icon className={cn("h-5 w-5", item.color, isActive ? "opacity-100" : "opacity-70")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-4">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-teal-50 p-5 border border-white shadow-lg shadow-blue-100/50 backdrop-blur-md">
          <p className="text-sm font-bold text-blue-900">Sales Assistant</p>
          <p className="text-xs text-blue-700/70 mt-1 mb-4 leading-relaxed font-medium">AI is ready to help you analyze leads and close deals.</p>
          <SalesAssistant />
        </div>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-full w-72 flex-col border-r border-slate-100 bg-white/60 backdrop-blur-2xl px-5 py-6 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
      <SidebarContent />
    </aside>
  );
}
