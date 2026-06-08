"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/features/pipeline/KanbanBoard";
import { AddLeadModal } from "@/components/features/unified/AddLeadModal";
import { UploadPdfModal } from "@/components/features/unified/UploadPdfModal";
import { AiFinderModal } from "@/components/features/unified/AiFinderModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UploadCloud, Brain, Search, Bell } from "lucide-react";
import Image from "next/image";

export default function UnifiedKanbanPage() {
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAiFinderOpen, setIsAiFinderOpen] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] gap-6">
      
      {/* Unified Action Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
         
         {/* Left: Branding */}
         <div className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden">
              <Image src="/logo.png" alt="Apprising Logo" width={48} height={48} className="object-contain p-1" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">Apprising Lead Manager</h2>
              <p className="text-sm text-slate-500 mt-1">Manage your healthcare prospects.</p>
            </div>
         </div>

         {/* Center: Search Bar */}
         <div className="flex-1 max-w-2xl relative mx-auto w-full xl:mx-8">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search leads, companies, or documents..."
              className="w-full h-10 pl-11 rounded-full bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 transition-all text-sm shadow-inner"
            />
         </div>

         {/* Right: Actions & Profile */}
         <div className="flex items-center gap-3 shrink-0 overflow-x-auto pb-1 xl:pb-0">
            <Button onClick={() => setIsAddLeadOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm font-semibold rounded-lg h-10 whitespace-nowrap">
               <UserPlus className="w-4 h-4" /> Add Lead
            </Button>
            <Button onClick={() => setIsUploadOpen(true)} variant="secondary" className="gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold rounded-lg h-10 whitespace-nowrap">
               <UploadCloud className="w-4 h-4" /> Upload PDF
            </Button>
            <Button onClick={() => setIsAiFinderOpen(true)} variant="outline" className="gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold rounded-lg h-10 whitespace-nowrap">
               <Brain className="w-4 h-4" /> AI Finder
            </Button>

            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

            <Button variant="ghost" size="icon" className="relative text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-full hidden md:flex h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 flex h-2 w-2 items-center justify-center rounded-full bg-pink-500 ring-2 ring-white"></span>
            </Button>
            <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-transparent hover:ring-indigo-500/20 transition-all hidden md:flex shadow-sm">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">AC</AvatarFallback>
            </Avatar>
         </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/50 shadow-inner">
         <KanbanBoard />
      </div>

      {/* Modals */}
      <AddLeadModal open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen} />
      <UploadPdfModal open={isUploadOpen} onOpenChange={setIsUploadOpen} />
      <AiFinderModal open={isAiFinderOpen} onOpenChange={setIsAiFinderOpen} />

    </div>
  );
}
