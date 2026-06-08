import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Search, Sparkles, Building2 } from "lucide-react";

export default function IntelligencePage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto pb-10">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-card p-10 text-center border shadow-sm mt-4">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-primary">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="absolute bottom-0 left-0 p-4 opacity-10 text-secondary">
          <Brain className="w-32 h-32" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-outfit text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            AI Lead Discovery
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Automatically find businesses in <span className="text-primary font-medium">Healthcare</span>, <span className="text-primary font-medium">Legal</span>, and <span className="text-primary font-medium">Trades</span> that are actively seeking Custom Software, AI Automation, or Cybersecurity services.
          </p>
        </div>
      </div>

      {/* Input Section */}
      <Card className="rounded-3xl overflow-hidden relative z-10 shadow-sm border">
        <CardHeader className="bg-muted/30 border-b pb-6">
          <CardTitle className="text-2xl font-outfit flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" /> Define Target Profile (ICP)
          </CardTitle>
          <CardDescription className="text-base">
            Tell the AI who to look for. It will crawl public directories and tech job postings to find matching signals.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Target Industry</label>
              <Input className="bg-background rounded-xl h-12" placeholder="e.g. Healthcare, Legal, Trades" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Target Service Need</label>
              <Input className="bg-background rounded-xl h-12" placeholder="e.g. HIPAA Compliance, Custom CRM, AI Automation" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Company Size</label>
              <Input className="bg-background rounded-xl h-12" placeholder="e.g. 10-50 employees" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Buying Signals</label>
              <Input className="bg-background rounded-xl h-12" placeholder="e.g. Using legacy software, recent data breach" />
            </div>
          </div>
          <Button className="w-full h-14 text-lg rounded-xl transition-all transform hover:scale-[1.01]" size="lg">
            <Sparkles className="w-5 h-5 mr-2" /> Start AI Discovery Scan
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="space-y-6 mt-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-2 bg-primary rounded-full" />
          <h3 className="font-outfit text-2xl font-bold text-foreground">Recent High-Intent Discoveries</h3>
        </div>
        
        <div className="grid gap-6">
            <Card className="rounded-3xl overflow-hidden hover:shadow-md transition-all group border">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-primary/5 p-6 flex flex-col items-center justify-center md:w-48 border-b md:border-b-0 md:border-r border-border">
                    <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-sm text-primary mb-3 group-hover:scale-110 transition-transform">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none font-semibold px-3 py-1 text-xs">
                      98% AI Match
                    </Badge>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-xl text-foreground">Oakridge Medical Clinic</h4>
                          <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-secondary-foreground">Needs Cybersecurity</Badge>
                        </div>
                        <p className="text-muted-foreground font-medium mb-3 flex items-center gap-2 text-sm">
                          Healthcare & Wellness <span className="w-1.5 h-1.5 rounded-full bg-border" /> Seattle, WA <span className="w-1.5 h-1.5 rounded-full bg-border" /> 20-50 emp.
                        </p>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border">
                          <p className="text-sm text-foreground">
                            <strong className="text-primary flex items-center gap-1.5 mb-1"><Search className="w-4 h-4"/> Detected Signal:</strong> 
                            Seeking IT consultants for HIPAA compliance audit. Expanding operations.
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <Button className="rounded-xl w-full sm:w-auto">Add to Pipeline</Button>
                        <Button variant="outline" className="rounded-xl w-full sm:w-auto">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl overflow-hidden hover:shadow-md transition-all group border">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-secondary/10 p-6 flex flex-col items-center justify-center md:w-48 border-b md:border-b-0 md:border-r border-border">
                    <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shadow-sm text-secondary mb-3 group-hover:scale-110 transition-transform">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 border-none font-semibold px-3 py-1 text-xs">
                      92% AI Match
                    </Badge>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-xl text-foreground">Sterling Law Partners</h4>
                          <Badge variant="secondary" className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide text-primary">Needs AI Automation</Badge>
                        </div>
                        <p className="text-muted-foreground font-medium mb-3 flex items-center gap-2 text-sm">
                          Legal <span className="w-1.5 h-1.5 rounded-full bg-border" /> New York, NY <span className="w-1.5 h-1.5 rounded-full bg-border" /> 50-100 emp.
                        </p>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border">
                          <p className="text-sm text-foreground">
                            <strong className="text-secondary flex items-center gap-1.5 mb-1"><Search className="w-4 h-4"/> Detected Signal:</strong> 
                            Expanding intake team; struggling with slow document processing times.
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <Button className="rounded-xl w-full sm:w-auto">Add to Pipeline</Button>
                        <Button variant="outline" className="rounded-xl w-full sm:w-auto">Dismiss</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
