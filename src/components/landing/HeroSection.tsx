import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, CheckCircle, Users, Clock, BarChart3 } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
             Simple Task Management for Small Teams
          </Badge>
          
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
            Stop drowning in
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}task chaos
            </span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
            TaskSaaS is the lean, clean task manager that small teams actually want to use. 
            No bloated enterprise features—just tasks, roles, and transparency.
          </p>
          
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="px-8 py-6 text-lg font-semibold">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle className="h-6 w-6 text-accent" />
              <span className="text-base font-medium">Setup in minutes</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Users className="h-6 w-6 text-accent" />
              <span className="text-base font-medium">Perfect for 2-20 people</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <BarChart3 className="h-6 w-6 text-accent" />
              <span className="text-base font-medium">Crystal clear reporting</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;