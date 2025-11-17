import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useConfig } from "@/contexts/ConfigContext";
import { FreightConfig, MatchKey } from "@/types/freight";
import { toast } from "sonner";

const matchKeyOptions: MatchKey[] = [
  "Invoice Number",
  "LR Number",
  "Trip ID",
  "Vehicle Number",
  "Invoice Date",
];

const clients = ["DHL Express", "Blue Dart", "FedEx", "Delhivery"];
const branches = ["Mumbai Central", "Delhi NCR", "Bangalore Tech Park", "Chennai Port"];
const transporters = ["VRL Logistics", "Rivigo", "TCI Express", "Gati"];

interface ConfigFormProps {
  editConfig?: FreightConfig | null;
  onEditComplete?: () => void;
}

export const ConfigForm = ({ editConfig, onEditComplete }: ConfigFormProps) => {
  const { addConfig, updateConfig } = useConfig();
  const [formData, setFormData] = useState<Partial<FreightConfig>>({
    client: "",
    branch: "",
    transporter: "",
    primaryMatchKey: "LR Number",
    fallbackKeys: [],
    allowPartialMatch: false,
    autoApprove: false,
    requireManualReview: false,
    allowedSenderDomains: "",
    acceptedSenderEmails: "",
  });

  useEffect(() => {
    if (editConfig) {
      setFormData(editConfig);
    }
  }, [editConfig]);

  const handleSubmit = () => {
    if (!formData.client || !formData.branch || !formData.transporter || !formData.primaryMatchKey) {
      toast.error("Please fill in all required fields");
      return;
    }

    const config: FreightConfig = {
      id: editConfig?.id || Date.now().toString(),
      client: formData.client,
      branch: formData.branch,
      transporter: formData.transporter,
      primaryMatchKey: formData.primaryMatchKey,
      fallbackKeys: formData.fallbackKeys || [],
      allowPartialMatch: formData.allowPartialMatch || false,
      autoApprove: formData.autoApprove || false,
      requireManualReview: formData.requireManualReview || false,
      allowedSenderDomains: formData.allowedSenderDomains,
      acceptedSenderEmails: formData.acceptedSenderEmails,
    };

    if (editConfig) {
      updateConfig(config);
      toast.success("Configuration updated successfully");
    } else {
      addConfig(config);
      toast.success("Configuration created successfully");
    }

    handleReset();
    onEditComplete?.();
  };

  const handleReset = () => {
    setFormData({
      client: "",
      branch: "",
      transporter: "",
      primaryMatchKey: "LR Number",
      fallbackKeys: [],
      allowPartialMatch: false,
      autoApprove: false,
      requireManualReview: false,
      allowedSenderDomains: "",
      acceptedSenderEmails: "",
    });
  };

  const addFallbackKey = (key: MatchKey) => {
    if (!formData.fallbackKeys?.includes(key) && key !== formData.primaryMatchKey) {
      setFormData({
        ...formData,
        fallbackKeys: [...(formData.fallbackKeys || []), key],
      });
    }
  };

  const removeFallbackKey = (key: MatchKey) => {
    setFormData({
      ...formData,
      fallbackKeys: formData.fallbackKeys?.filter(k => k !== key) || [],
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {editConfig ? "Edit Configuration" : "Create Configuration"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Entity Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Entity Selection</h3>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client (Consignor) *</Label>
            <Select value={formData.client} onValueChange={(value) => setFormData({ ...formData, client: value })}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch *</Label>
            <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
              <SelectTrigger id="branch">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map(branch => (
                  <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transporter">Transporter *</Label>
            <Select value={formData.transporter} onValueChange={(value) => setFormData({ ...formData, transporter: value })}>
              <SelectTrigger id="transporter">
                <SelectValue placeholder="Select transporter" />
              </SelectTrigger>
              <SelectContent>
                {transporters.map(transporter => (
                  <SelectItem key={transporter} value={transporter}>{transporter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Matching Logic */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Matching Logic</h3>
          
          <div className="space-y-2">
            <Label htmlFor="primaryKey">Primary Match Key *</Label>
            <Select 
              value={formData.primaryMatchKey} 
              onValueChange={(value: MatchKey) => setFormData({ ...formData, primaryMatchKey: value })}
            >
              <SelectTrigger id="primaryKey">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {matchKeyOptions.map(key => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fallback Match Keys</Label>
            <Select onValueChange={(value: MatchKey) => addFallbackKey(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Add fallback keys" />
              </SelectTrigger>
              <SelectContent>
                {matchKeyOptions
                  .filter(key => key !== formData.primaryMatchKey && !formData.fallbackKeys?.includes(key))
                  .map(key => (
                    <SelectItem key={key} value={key}>{key}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.fallbackKeys?.map(key => (
                <Badge key={key} variant="secondary" className="gap-1">
                  {key}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFallbackKey(key)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="partialMatch">Allow Partial Match</Label>
              <p className="text-xs text-muted-foreground">
                System can suggest candidates when exact match is not found
              </p>
            </div>
            <Switch
              id="partialMatch"
              checked={formData.allowPartialMatch}
              onCheckedChange={(checked) => setFormData({ ...formData, allowPartialMatch: checked })}
            />
          </div>
        </div>

        {/* Auto-Action */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Auto-Action</h3>
          
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="autoApprove">Auto-approve when no mismatch</Label>
            </div>
            <Switch
              id="autoApprove"
              checked={formData.autoApprove}
              onCheckedChange={(checked) => setFormData({ ...formData, autoApprove: checked })}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="manualReview">Always require manual review</Label>
              <p className="text-xs text-muted-foreground">Overrides auto-approve</p>
            </div>
            <Switch
              id="manualReview"
              checked={formData.requireManualReview}
              onCheckedChange={(checked) => setFormData({ ...formData, requireManualReview: checked })}
            />
          </div>
        </div>

        {/* Email Routing */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">Email Routing (Optional)</h3>
          
          <div className="space-y-2">
            <Label htmlFor="domains">Allowed Sender Domains</Label>
            <Input
              id="domains"
              placeholder="@dhl.com, @vrll.in"
              value={formData.allowedSenderDomains}
              onChange={(e) => setFormData({ ...formData, allowedSenderDomains: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emails">Accepted Sender Emails</Label>
            <Input
              id="emails"
              placeholder="transport@company.com, billing@company.com"
              value={formData.acceptedSenderEmails}
              onChange={(e) => setFormData({ ...formData, acceptedSenderEmails: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSubmit} className="flex-1">
            Save Config
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
