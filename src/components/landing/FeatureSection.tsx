import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Shield, 
  Users, 
  BarChart3, 
  Clock, 
  Settings, 
  FileText,
  UserCheck,
  Activity
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Clean separation between Admins and Users. No confusion, no chaos.",
    badge: "Core Feature"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Add team members, assign tasks, and track progress in real-time.",
    badge: "Essential"
  },
  {
    icon: BarChart3,
    title: "Activity Logging",
    description: "Complete transparency with detailed logs of who did what and when.",
    badge: "Transparency"
  },
  {
    icon: Clock,
    title: "Task Tracking",
    description: "Create, assign, update, and complete tasks with intuitive workflows.",
    badge: "Productivity"
  },
  {
    icon: Settings,
    title: "Customizable",
    description: "Built modular so you can adapt it to your team's specific needs.",
    badge: "Flexible"
  },
  {
    icon: FileText,
    title: "Export Ready",
    description: "Export your data to CSV and integrate with your existing tools.",
    badge: "Coming Soon"
  }
];

const perspectives = [
  {
    role: "For Admins",
    title: "Stay on top of every task, user, and deadline",
    features: [
      "Create and assign tasks to team members",
      "Monitor all activity with detailed logs",
      "Manage user permissions and access",
      "Get dashboard insights on team performance"
    ],
    icon: UserCheck,
    color: "text-primary"
  },
  {
    role: "For Users",
    title: "Focus on your work without the noise",
    features: [
      "See only tasks assigned to you",
      "Update task status with one click",
      "Manage your profile and preferences",
      "Track your daily and weekly progress"
    ],
    icon: Activity,
    color: "text-accent"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Everything you need, nothing you don't
          </h2>
          <p className="text-xl text-muted-foreground">
            Unlike bloated enterprise tools, TaskSaaS focuses on what small teams actually need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Perspectives */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            Built for both perspectives
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're managing the team or focusing on your tasks, TaskSaaS adapts to your role.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {perspectives.map((perspective, index) => (
            <Card key={index} className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <perspective.icon className={`h-8 w-8 ${perspective.color}`} />
                  <Badge variant="outline" className="text-sm">
                    {perspective.role}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{perspective.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {perspective.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`mt-1 h-2 w-2 rounded-full ${perspective.color === 'text-primary' ? 'bg-primary' : 'bg-accent'}`}></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;