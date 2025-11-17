import { Package } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Freight Audit</h1>
            <p className="text-xs text-muted-foreground">Invoice verification & compliance</p>
          </div>
        </div>
      </div>
    </header>
  );
};
