import { CheckSquare, Zap, Target, BarChart3 } from "lucide-react";

const features = [
  {
    icon: CheckSquare,
    title: "Brutally Simple",
    description: "No bloat. No unnecessary features. Just tasks, priorities, and deadlines.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Add tasks in seconds. Navigate instantly. Zero friction.",
  },
  {
    icon: Target,
    title: "Laser Focus",
    description: "See what matters now. Everything else fades away. Pure productivity.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    description: "Clear metrics. Visual progress. Know exactly where you stand.",
  },
];

export const Features = () => {
  return (
    <section className="py-32 bg-background relative">
      {/* Section label */}
      <div className="container mx-auto px-6 mb-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-[2px] bg-foreground" />
          <span className="text-sm font-bold uppercase tracking-wider">Features</span>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 border-2 border-border hover:border-foreground transition-all hover:-translate-y-1"
            >
              <div className="flex items-start gap-6">
                <div className="p-3 border-2 border-foreground bg-background group-hover:bg-foreground transition-colors">
                  <feature.icon className="h-6 w-6 group-hover:text-background transition-colors" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geometric decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 border-l-2 border-b-2 border-border opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 border-r-2 border-t-2 border-border opacity-50" />
    </section>
  );
};
