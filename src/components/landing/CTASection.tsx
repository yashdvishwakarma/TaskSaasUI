import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, CheckCircle, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  {
    icon: Clock,
    title: "5-minute setup",
    description: "No complex configuration needed"
  },
  {
    icon: DollarSign,
    title: "Free to start",
    description: "Try all features with no commitment"
  },
  {
    icon: CheckCircle,
    title: "No credit card",
    description: "Start immediately, upgrade when ready"
  }
];

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-12 lg:p-20">
            <div className="mx-auto max-w-3xl text-center">
              <Badge className="mb-6 bg-accent text-accent-foreground">
                ✨ Join 500+ teams already using TaskSaaS
              </Badge>
              
              <h2 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
                Ready to end the
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {" "}task chaos?
                </span>
              </h2>
              
              <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground leading-relaxed">
                Stop wrestling with bloated enterprise tools. Start with TaskSaaS and get your team 
                organized in minutes, not months.
              </p>
              
              <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-accent/10 p-3">
                      <benefit.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{benefit.title}</div>
                      <div className="text-sm text-muted-foreground">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
                  <Link to="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
                  <Link to="/login">
                    I Already Have an Account
                  </Link>
                </Button>
              </div>
              
              <p className="mt-6 text-sm text-muted-foreground">
                Free trial includes all features • No setup fees • Cancel anytime
              </p>
            </div>
          </CardContent>
          
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl"></div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;