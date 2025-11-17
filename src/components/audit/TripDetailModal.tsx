import { useState } from "react";
import { Trip, Charge } from "@/types/freight";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "./StatusBadge";
import { VarianceCell } from "./VarianceCell";
import { ChargeBreakupTable } from "./ChargeBreakupTable";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, CheckCircle2, XCircle, Truck, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripDetailModalProps {
  trip: Trip | null;
  open: boolean;
  onClose: () => void;
  onApprove: (tripId: string) => void;
  onReject: (tripId: string) => void;
  onChargeUpdate: (tripId: string, chargeId: string, decision: "accepted" | "rejected", comment?: string) => void;
}

export const TripDetailModal = ({ trip, open, onClose, onApprove, onReject, onChargeUpdate }: TripDetailModalProps) => {
  const [openSections, setOpenSections] = useState<string[]>(["origin", "base", "charges", "gst"]);

  if (!trip) return null;

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const baseVariance = trip.invoiceBaseFreight - trip.proformaBaseFreight;
  const chargesVariance = trip.invoiceAdditionalCharges - trip.proformaAdditionalCharges;
  const gstVariance = (trip.invoiceGST || 0) - (trip.proformaGST || 0);

  const CheckSection = ({ 
    id, 
    title, 
    matched, 
    contractedLabel, 
    contractedValue, 
    invoiceLabel, 
    invoiceValue, 
    variance 
  }: {
    id: string;
    title: string;
    matched: boolean;
    contractedLabel: string;
    contractedValue: string;
    invoiceLabel: string;
    invoiceValue: string;
    variance: number;
  }) => {
    const isOpen = openSections.includes(id);
    
    return (
      <Collapsible open={isOpen} onOpenChange={() => toggleSection(id)}>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
              <span className="font-semibold">{title}</span>
            </div>
            <div className="flex items-center gap-2">
              {matched ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
              <span className={cn("text-sm font-medium", matched ? "text-success" : "text-destructive")}>
                {matched ? "Matched" : "Unmatched"}
              </span>
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 p-4 bg-muted/30 rounded-lg space-y-2 border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{contractedLabel}</span>
              <span className="font-medium">{contractedValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{invoiceLabel}</span>
              <span className="font-medium">{invoiceValue}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Variance</span>
              <VarianceCell variance={variance} />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">{trip.tripId}</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>{trip.vehicleNumber || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>LR: {trip.lrNumber}</span>
                </div>
              </div>
            </div>
            <StatusBadge status={trip.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Checks Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Trip Verification
            </h3>
            
            <CheckSection
              id="origin"
              title="Origin - Destination"
              matched={true}
              contractedLabel="Route"
              contractedValue={`${trip.origin} → ${trip.destination}`}
              invoiceLabel="Invoice Route"
              invoiceValue={`${trip.origin} → ${trip.destination}`}
              variance={0}
            />

            <CheckSection
              id="base"
              title="Base Freight"
              matched={baseVariance === 0}
              contractedLabel="Contracted Base Freight"
              contractedValue={formatCurrency(trip.proformaBaseFreight)}
              invoiceLabel="Invoice Base Freight"
              invoiceValue={formatCurrency(trip.invoiceBaseFreight)}
              variance={baseVariance}
            />

            <CheckSection
              id="charges"
              title="Additional Charges"
              matched={chargesVariance === 0}
              contractedLabel="Contracted Additional Charges"
              contractedValue={formatCurrency(trip.proformaAdditionalCharges)}
              invoiceLabel="Invoice Additional Charges"
              invoiceValue={formatCurrency(trip.invoiceAdditionalCharges)}
              variance={chargesVariance}
            />

            {trip.proformaGST !== undefined && trip.invoiceGST !== undefined && (
              <CheckSection
                id="gst"
                title="GST"
                matched={gstVariance === 0}
                contractedLabel="Contracted GST"
                contractedValue={formatCurrency(trip.proformaGST)}
                invoiceLabel="Invoice GST"
                invoiceValue={formatCurrency(trip.invoiceGST)}
                variance={gstVariance}
              />
            )}
          </div>

          {/* Charge Breakup */}
          {trip.charges && trip.charges.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Charge Breakup</h3>
              <ChargeBreakupTable 
                charges={trip.charges} 
                onChargeUpdate={(chargeId, decision, comment) => 
                  onChargeUpdate(trip.id, chargeId, decision, comment)
                }
              />
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => onReject(trip.id)}
          >
            Reject Trip
          </Button>
          <Button
            onClick={() => onApprove(trip.id)}
            className="bg-success hover:bg-success/90"
          >
            Approve Trip
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
