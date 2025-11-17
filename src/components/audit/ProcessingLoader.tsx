import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const ProcessingLoader = () => {
  return (
    <Card className="border-primary/20">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8">
        <div className="relative mb-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          AI is processing your invoice…
        </h3>
        <p className="text-muted-foreground text-center max-w-md">
          Crunching numbers so you don't have to. 🚚🤖
        </p>
      </CardContent>
    </Card>
  );
};
