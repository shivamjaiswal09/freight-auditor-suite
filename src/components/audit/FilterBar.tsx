import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfig } from "@/contexts/ConfigContext";
import { Upload } from "lucide-react";

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
  onUploadClick?: () => void;
  showUploadButton?: boolean;
}

export const FilterBar = ({
  client,
  branch,
  transporter,
  onClientChange,
  onBranchChange,
  onTransporterChange,
  onUploadClick,
  showUploadButton = false,
}: FilterBarProps) => {
  const { getActiveConfig } = useConfig();
  const activeConfig = getActiveConfig(client, branch, transporter);

  return (
    <div className="bg-card border-b shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-52">
              <Select value={client} onValueChange={onClientChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-52">
              <Select value={branch} onValueChange={onBranchChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(b => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-52">
              <Select value={transporter} onValueChange={onTransporterChange}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select transporter" />
                </SelectTrigger>
                <SelectContent>
                  {transporters.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {activeConfig && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Matching by:</span>
                <Badge variant="secondary" className="font-medium">
                  {activeConfig.primaryMatchKey}
                </Badge>
              </div>
            )}
          </div>

          {showUploadButton && onUploadClick && (
            <Button onClick={onUploadClick} size="lg" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
