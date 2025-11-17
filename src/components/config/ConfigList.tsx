import { useState } from "react";
import { Search, Edit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConfig } from "@/contexts/ConfigContext";
import { FreightConfig } from "@/types/freight";

interface ConfigListProps {
  onEdit: (config: FreightConfig) => void;
}

export const ConfigList = ({ onEdit }: ConfigListProps) => {
  const { configs } = useConfig();
  const [search, setSearch] = useState("");

  const filteredConfigs = configs.filter(config =>
    config.client.toLowerCase().includes(search.toLowerCase()) ||
    config.branch.toLowerCase().includes(search.toLowerCase()) ||
    config.transporter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">Existing Configurations</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by client, branch or transporter"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredConfigs.map((config) => (
            <div
              key={config.id}
              className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{config.client}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{config.branch}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Transporter:</span>{" "}
                    <span className="text-foreground">{config.transporter}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Primary: {config.primaryMatchKey}
                    </Badge>
                    {config.fallbackKeys.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        +{config.fallbackKeys.length} fallback
                      </Badge>
                    )}
                    {config.autoApprove && (
                      <Badge className="text-xs bg-success text-success-foreground">
                        Auto-approve
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(config)}
                  className="ml-2"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
