import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Globe, Activity, Cpu } from "lucide-react";

const mockCompanies = [
  { id: 1, name: "Dr. Smith Dental", industry: "Healthcare", employees: "10-50", maturity: 45, tech: ["WordPress", "Google Analytics"], aiReady: "Medium" },
  { id: 2, name: "BuildIt Construction", industry: "Construction", employees: "50-200", maturity: 20, tech: ["Wix"], aiReady: "High" },
  { id: 3, name: "TechNova Solutions", industry: "Software", employees: "200-500", maturity: 85, tech: ["React", "AWS", "HubSpot"], aiReady: "Low" },
];

export default function CompaniesPage() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-outfit text-3xl font-bold tracking-tight">Company Intelligence</h2>
          <p className="text-muted-foreground">Enriched company profiles and digital maturity analysis.</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search companies..." className="pl-8" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockCompanies.map((company) => (
          <Card key={company.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <CardDescription>{company.industry} • {company.employees} emp.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-muted-foreground"><Activity className="w-4 h-4 mr-2" /> Digital Maturity</span>
                  <span className="font-medium">{company.maturity}/100</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className={`h-2 rounded-full ${company.maturity < 50 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${company.maturity}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Cpu className="w-4 h-4 mr-2" /> Detected Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {company.tech.map(t => (
                    <Badge key={t} variant="secondary" className="text-xs font-normal">{t}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground">AI Sales Opportunity</span>
                <Badge variant={company.aiReady === 'High' ? 'default' : 'outline'} className={company.aiReady === 'High' ? 'bg-primary/10 text-primary' : ''}>
                  {company.aiReady} Priority
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
