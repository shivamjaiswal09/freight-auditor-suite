import { useState } from "react";
import { ConfigList } from "@/components/config/ConfigList";
import { ConfigForm } from "@/components/config/ConfigForm";
import { FreightConfig } from "@/types/freight";

export const ConfigPage = () => {
  const [editingConfig, setEditingConfig] = useState<FreightConfig | null>(null);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Freight Audit Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define how invoices should be matched to proforma records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigList onEdit={setEditingConfig} />
        <ConfigForm 
          editConfig={editingConfig} 
          onEditComplete={() => setEditingConfig(null)}
        />
      </div>
    </div>
  );
};
