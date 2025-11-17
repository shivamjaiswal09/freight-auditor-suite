import { useState } from "react";
import { Charge } from "@/types/freight";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VarianceCell } from "./VarianceCell";
import { Check, X } from "lucide-react";

interface ChargeBreakupTableProps {
  charges: Charge[];
  onChargeUpdate: (chargeId: string, decision: "accepted" | "rejected", comment?: string) => void;
}

export const ChargeBreakupTable = ({ charges, onChargeUpdate }: ChargeBreakupTableProps) => {
  const [rejectingChargeId, setRejectingChargeId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleReject = (chargeId: string) => {
    if (rejectingChargeId === chargeId) {
      onChargeUpdate(chargeId, "rejected", rejectComment);
      setRejectingChargeId(null);
      setRejectComment("");
    } else {
      setRejectingChargeId(chargeId);
      setRejectComment("");
    }
  };

  const handleAccept = (chargeId: string) => {
    onChargeUpdate(chargeId, "accepted");
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Charge Type</TableHead>
            <TableHead className="text-right font-semibold">Contracted Amt</TableHead>
            <TableHead className="text-right font-semibold">Invoice Amt</TableHead>
            <TableHead className="text-right font-semibold">Variance</TableHead>
            <TableHead className="text-right font-semibold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((charge) => (
            <>
              <TableRow key={charge.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{charge.type}</TableCell>
                <TableCell className="text-right">{formatCurrency(charge.contractedAmount)}</TableCell>
                <TableCell className="text-right">{formatCurrency(charge.invoiceAmount)}</TableCell>
                <TableCell className="text-right">
                  <VarianceCell variance={charge.variance} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {charge.decision === "accepted" ? (
                      <span className="text-xs font-medium text-success flex items-center gap-1">
                        <Check className="h-3 w-3" /> Accepted
                      </span>
                    ) : charge.decision === "rejected" ? (
                      <span className="text-xs font-medium text-destructive flex items-center gap-1">
                        <X className="h-3 w-3" /> Rejected
                      </span>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-success text-success hover:bg-success/10"
                          onClick={() => handleAccept(charge.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-destructive text-destructive hover:bg-destructive/10"
                          onClick={() => handleReject(charge.id)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
              {rejectingChargeId === charge.id && (
                <TableRow>
                  <TableCell colSpan={5} className="bg-muted/20">
                    <div className="space-y-2 py-2">
                      <label className="text-sm font-medium">Rejection Comment</label>
                      <Textarea
                        placeholder="Explain why you're rejecting this charge..."
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        className="min-h-[60px]"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setRejectingChargeId(null);
                            setRejectComment("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(charge.id)}
                          disabled={!rejectComment.trim()}
                        >
                          Confirm Rejection
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
