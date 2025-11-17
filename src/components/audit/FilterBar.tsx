import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfig } from "@/contexts/ConfigContext";

const clients = ["DHL Express", "Blue Dart", "FedEx", "Delhivery"];
const branches = ["Mumbai Central", "Delhi NCR", "Bangalore Tech Park", "Chennai Port"];
const transporters = ["VRL Logistics", "Rivigo", "TCI Express", "Gati"];

interface FilterBarProps {
  client: string;
  branch: string;
  transporter: string;
  onClientChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onTransporterChange: (value: string) => void;
}

export const FilterBar = ({
  client,
  branch,
  transporter,
  onClientChange,
  onBranchChange,
  onTransporterChange,
}: FilterBarProps) => {
  const { getActiveConfig } = useConfig();
  const activeConfig = getActiveConfig(client, branch, transporter);

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Freight Audit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload transporter invoices and compare against contracted proforma
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="space-y-2">
          <Label htmlFor="filter-client">Client (Consignor)</Label>
          <Select value={client} onValueChange={onClientChange}>
            <SelectTrigger id="filter-client">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-branch">Branch</Label>
          <Select value={branch} onValueChange={onBranchChange}>
            <SelectTrigger id="filter-branch">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map(b => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="filter-transporter">Transporter</Label>
          <Select value={transporter} onValueChange={onTransporterChange}>
            <SelectTrigger id="filter-transporter">
              <SelectValue placeholder="Select transporter" />
            </SelectTrigger>
            <SelectContent>
              {transporters.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeConfig && (
        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-muted-foreground">Active Matching Key:</span>
          <Badge variant="secondary" className="font-medium">
            {activeConfig.primaryMatchKey}
          </Badge>
          {activeConfig.fallbackKeys.length > 0 && (
            <Badge variant="outline" className="text-xs">
              +{activeConfig.fallbackKeys.length} fallback
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
