import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, CheckCircle, Users, Clock, BarChart3 } from "lucide-react";

// const HeroSection = () => {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-20 lg:py-28">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-4xl text-center">
//           <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
//              Simple Task Management for Small Teams
//           </Badge>
          
//           <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-7xl">
//             Stop drowning in
//             <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//               {" "}task chaos
//             </span>
//           </h1>
          
//           <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
//             TaskSaaS is the lean, clean task manager that small teams actually want to use. 
//             No bloated enterprise features—just tasks, roles, and transparency.
//           </p>
          
//           <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
//             <Button size="lg" className="px-8 py-6 text-lg font-semibold">
//               Start Free Trial
//               <ArrowRight className="ml-2 h-5 w-5" />
//             </Button>
//             <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
//               Watch Demo
//             </Button>
//           </div>
          
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//             <div className="flex items-center justify-center gap-3">
//               <CheckCircle className="h-6 w-6 text-accent" />
//               <span className="text-base font-medium">Setup in minutes</span>
//             </div>
//             <div className="flex items-center justify-center gap-3">
//               <Users className="h-6 w-6 text-accent" />
//               <span className="text-base font-medium">Perfect for 2-20 people</span>
//             </div>
//             <div className="flex items-center justify-center gap-3">
//               <BarChart3 className="h-6 w-6 text-accent" />
//               <span className="text-base font-medium">Crystal clear reporting</span>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Decorative elements */}
//       <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl"></div>
//       <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl"></div>
//     </section>
//   );
// };

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-primary/5 py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          {/* Larger, more prominent badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-primary">
            <Clock className="h-5 w-5" />
            <span className="text-lg font-semibold">Simple Task Management for Small Teams</span>
          </div>
          
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-tight">
            Stop drowning in
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2">
              task chaos
            </span>
          </h1>
          
          <p className="mx-auto mb-10 max-w-2xl text-xl sm:text-2xl text-muted-foreground leading-relaxed">
            TaskSaaS is the lean, clean task manager that small teams actually want to use. 
            No bloated enterprise features—just tasks, roles, and transparency.
          </p>
          
          <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="px-10 py-7 text-lg font-semibold shadow-xl hover:shadow-2xl transition-shadow">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 animate-pulse" />
            </Button>
            <Button variant="outline" size="lg" className="px-10 py-7 text-lg border-2">
              Watch Demo
            </Button>
          </div>
          
          {/* Improved feature cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="group flex flex-col items-center gap-4 rounded-2xl bg-background/50 backdrop-blur p-6 border shadow-sm hover:shadow-md transition-all">
              <div className="rounded-full bg-accent/20 p-3 group-hover:bg-accent/30 transition-colors">
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
              <span className="text-lg font-bold text-foreground">Setup in minutes</span>
              <span className="text-sm text-muted-foreground">Get your team running instantly</span>
            </div>
            
            <div className="group flex flex-col items-center gap-4 rounded-2xl bg-background/50 backdrop-blur p-6 border shadow-sm hover:shadow-md transition-all">
              <div className="rounded-full bg-primary/20 p-3 group-hover:bg-primary/30 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <span className="text-lg font-bold text-foreground">Perfect for 2-20 people</span>
              <span className="text-sm text-muted-foreground">Scales with your growing team</span>
            </div>
            
            <div className="group flex flex-col items-center gap-4 rounded-2xl bg-background/50 backdrop-blur p-6 border shadow-sm hover:shadow-md transition-all">
              <div className="rounded-full bg-accent/20 p-3 group-hover:bg-accent/30 transition-colors">
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
              <span className="text-lg font-bold text-foreground">Crystal clear reporting</span>
              <span className="text-sm text-muted-foreground">Know exactly where you stand</span>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-primary/5 to-accent/5 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;