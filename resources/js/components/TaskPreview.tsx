import { Check } from "lucide-react";

const tasks = [
  { id: 1, text: "Review Q4 marketing strategy", completed: true },
  { id: 2, text: "Design new landing page mockups", completed: true },
  { id: 3, text: "Schedule team standup meeting", completed: false },
  { id: 4, text: "Update project documentation", completed: false },
  { id: 5, text: "Prepare investor pitch deck", completed: false },
];

export const TaskPreview = () => {
  return (
    <section className="py-32 bg-muted relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.03]"
           style={{
             backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 1px, transparent 1px, transparent 40px),
                              repeating-linear-gradient(90deg, hsl(var(--foreground)) 0px, hsl(var(--foreground)) 1px, transparent 1px, transparent 40px)`
           }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-foreground" />
            <span className="text-sm font-bold uppercase tracking-wider">Interface</span>
            <div className="w-12 h-[2px] bg-foreground" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Clean. Clear. Complete.
          </h2>
          <p className="text-xl text-muted-foreground">
            No clutter. No confusion. Just your tasks and nothing else.
          </p>
        </div>

        {/* Task list mockup */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-background border-4 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {/* Header */}
            <div className="mb-8 pb-4 border-b-2 border-border">
              <h3 className="text-2xl font-bold">Today's Tasks</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {tasks.filter(t => !t.completed).length} remaining
              </p>
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 p-4 border-2 border-border hover:border-foreground transition-colors group"
                >
                  <div
                    className={`w-6 h-6 border-2 border-foreground flex items-center justify-center transition-colors ${
                      task.completed ? "bg-foreground" : "bg-background"
                    }`}
                  >
                    {task.completed && <Check className="h-4 w-4 text-background" />}
                  </div>
                  <span
                    className={`flex-1 font-medium ${
                      task.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input mockup */}
            <div className="mt-6 pt-6 border-t-2 border-border">
              <div className="flex gap-4">
                <div className="flex-1 border-2 border-border px-4 py-3 text-muted-foreground font-medium">
                  Add a new task...
                </div>
                <button className="px-6 py-3 bg-foreground text-background font-bold hover:bg-accent transition-colors">
                  ADD
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
