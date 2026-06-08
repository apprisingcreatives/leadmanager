import { LeadsProvider } from "@/lib/context/LeadsContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-h-full p-4 md:p-6">
          <LeadsProvider>
            {children}
          </LeadsProvider>
        </main>
      </div>
    </div>
  );
}
