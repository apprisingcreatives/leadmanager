"use client";

import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";
import * as React from "react";

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" }) + " mr-2"}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle mobile menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6 flex flex-col h-full border-r">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div onClick={() => setIsOpen(false)} className="flex flex-col h-full w-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads, companies, or documents..."
            className="w-full appearance-none bg-muted/50 pl-9 rounded-full shadow-none border-transparent focus-visible:ring-primary/50 focus-visible:bg-background transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-primary ring-2 ring-background">
            <span className="sr-only">Unread notifications</span>
          </span>
        </Button>
        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">AC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
