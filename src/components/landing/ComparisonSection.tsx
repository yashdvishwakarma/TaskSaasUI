import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Check, X, Star } from "lucide-react";

const comparisons = [
  {
    feature: "Setup Time",
    taskSaas: "5 minutes",
    taskSaasIcon: Check,
    competitors: "Days/Weeks",
    competitorsIcon: X
  },
  {
    feature: "Learning Curve",
    taskSaas: "Intuitive",
    taskSaasIcon: Check,
    competitors: "Steep",
    competitorsIcon: X
  },
  {
    feature: "Price for Small Teams",
    taskSaas: "Affordable",
    taskSaasIcon: Check,
    competitors: "$$$",
    competitorsIcon: X
  },
  {
    feature: "Customization",
    taskSaas: "Modular & Flexible",
    taskSaasIcon: Check,
    competitors: "Rigid",
    competitorsIcon: X
  },
  {
    feature: "Transparency",
    taskSaas: "Full Activity Logs",
    taskSaasIcon: Check,
    competitors: "Limited",
    competitorsIcon: X
  }
];

const testimonials = [
  {
    quote: "Finally, a task manager that doesn't try to be everything. TaskSaaS just works.",
    author: "Sarah Chen",
    role: "Freelance Designer",
    rating: 5
  },
  {
    quote: "We switched from Asana and haven't looked back. Much cleaner interface.",
    author: "Mike Rodriguez",
    role: "Startup Founder",
    rating: 5
  },
  {
    quote: "The role separation is perfect. Our team knows exactly what they need to do.",
    author: "Emma Thompson",
    role: "Agency Owner",
    rating: 5
  }
];

const ComparisonSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Why Choose TaskSaaS */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Why teams choose TaskSaaS over the "big players"
          </h2>
          <p className="text-xl text-muted-foreground">
            We're not trying to compete with enterprise monsters. We're solving real problems for real teams.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mx-auto max-w-4xl mb-20">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5 text-center">
              <CardTitle className="text-2xl">TaskSaaS vs. Enterprise Tools</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1">
                {/* Header */}
                <div className="grid grid-cols-3 border-b bg-muted/20">
                  <div className="p-4 font-medium">Feature</div>
                  <div className="p-4 font-medium text-center border-l">
                    <Badge className="bg-primary text-primary-foreground">TaskSaaS</Badge>
                  </div>
                  <div className="p-4 font-medium text-center border-l text-muted-foreground">
                    Asana/Jira/ClickUp
                  </div>
                </div>
                
                {/* Comparison Rows */}
                {comparisons.map((item, index) => (
                  <div key={index} className="grid grid-cols-3 border-b last:border-b-0">
                    <div className="p-4 font-medium">{item.feature}</div>
                    <div className="p-4 text-center border-l">
                      <div className="flex items-center justify-center gap-2">
                        <item.taskSaasIcon className="h-5 w-5 text-accent" />
                        <span className="text-sm font-medium">{item.taskSaas}</span>
                      </div>
                    </div>
                    <div className="p-4 text-center border-l">
                      <div className="flex items-center justify-center gap-2">
                        <item.competitorsIcon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{item.competitors}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h3 className="mb-4 text-3xl font-bold tracking-tight">
            What our users say
          </h3>
          <p className="text-lg text-muted-foreground">
            Real feedback from real teams who made the switch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="mb-4 text-sm italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-medium text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;