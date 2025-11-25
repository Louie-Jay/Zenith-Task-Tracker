import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-32 bg-foreground text-background relative overflow-hidden">
      {/* Geometric decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-96 h-96 border-4 border-background rotate-12" />
        <div className="absolute bottom-10 left-10 w-64 h-64 border-4 border-background -rotate-6" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-background">
            <span className="text-sm font-semibold uppercase tracking-wider">
              Ready to Focus?
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Start Your Journey
            <br />
            to the Zenith
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-background/70 max-w-2xl mx-auto">
            Join thousands who've already reached peak productivity.
            Start free, upgrade whenever.
          </p>

          {/* CTA Button */}
          <div className="pt-8">
            <Button
              size="lg"
              className="bg-background text-foreground hover:bg-background/90 font-bold text-lg px-12 py-6 group border-2 border-background"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature list */}
          <div className="pt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold">
            <span>✓ No credit card required</span>
            <span className="text-background/40">|</span>
            <span>✓ 14-day free trial</span>
            <span className="text-background/40">|</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};
