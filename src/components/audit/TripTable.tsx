import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Check, X, Download } from "lucide-react";
import { Trip } from "@/types/freight";
import { toast } from "sonner";

interface TripTableProps {
  trips: Trip[];
  onTripsUpdate: (trips: Trip[]) => void;
}

export const TripTable = ({ trips, onTripsUpdate }: TripTableProps) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [rejectionComment, setRejectionComment] = useState("");

  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString("en-IN")}`;
  };

  const handleAccept = (tripId: string) => {
    const updatedTrips = trips.map(trip =>
      trip.id === tripId ? { ...trip, decision: "accepted" as const } : trip
    );
    onTripsUpdate(updatedTrips);
    toast.success("Trip accepted");
  };

  const handleRejectClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setRejectionComment(trip.rejectionComment || "");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedTrip) return;
    
    const updatedTrips = trips.map(trip =>
      trip.id === selectedTrip.id
        ? { ...trip, decision: "rejected" as const, rejectionComment }
        : trip
    );
    onTripsUpdate(updatedTrips);
    setRejectDialogOpen(false);
    setSelectedTrip(null);
    setRejectionComment("");
    toast.success("Trip rejected");
  };

  const handleSubmit = () => {
    const acceptedCount = trips.filter(t => t.decision === "accepted").length;
    const rejectedCount = trips.filter(t => t.decision === "rejected").length;
    const pendingCount = trips.length - acceptedCount - rejectedCount;

    if (pendingCount > 0) {
      toast.error(`Please review all trips. ${pendingCount} trip(s) pending.`);
      return;
    }

    toast.success(`Audit submitted: ${acceptedCount} accepted, ${rejectedCount} rejected`);
  };

  const getStatusBadge = (status: Trip["status"]) => {
    const variants = {
      "Match": "default",
      "Mismatch - Base": "secondary",
      "Mismatch - Charges": "secondary",
      "Mismatch - Both": "destructive",
    } as const;

    return (
      <Badge variant={variants[status] || "default"} className="whitespace-nowrap">
        {status}
      </Badge>
    );
  };

  const acceptedCount = trips.filter(t => t.decision === "accepted").length;
  const rejectedCount = trips.filter(t => t.decision === "rejected").length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trip-wise Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Trip ID</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">LR Number</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Route</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Proforma Base</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Invoice Base</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Proforma Charges</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Invoice Charges</th>
                <th className="text-right p-3 text-sm font-medium text-muted-foreground">Difference</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center p-3 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const totalDiff = (trip.invoiceBaseFreight - trip.proformaBaseFreight) +
                  (trip.invoiceAdditionalCharges - trip.proformaAdditionalCharges);

                return (
                  <tr key={trip.id} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 text-sm">{trip.tripId}</td>
                    <td className="p-3 text-sm">{trip.lrNumber}</td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      {trip.origin} → {trip.destination}
                    </td>
                    <td className="p-3 text-sm text-right">{formatCurrency(trip.proformaBaseFreight)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(trip.invoiceBaseFreight)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(trip.proformaAdditionalCharges)}</td>
                    <td className="p-3 text-sm text-right">{formatCurrency(trip.invoiceAdditionalCharges)}</td>
                    <td className={`p-3 text-sm text-right font-medium ${totalDiff !== 0 ? 'text-destructive' : 'text-success'}`}>
                      {formatCurrency(Math.abs(totalDiff))}
                    </td>
                    <td className="p-3 text-center">{getStatusBadge(trip.status)}</td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-center">
                        {trip.decision === "accepted" ? (
                          <Badge className="bg-success text-success-foreground">Accepted</Badge>
                        ) : trip.decision === "rejected" ? (
                          <Badge variant="destructive">Rejected</Badge>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAccept(trip.id)}
                              className="h-8 px-3"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectClick(trip)}
                              className="h-8 px-3 text-destructive hover:text-destructive"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
          <div className="flex gap-3">
            <Badge variant="outline" className="px-3 py-1">
              Accepted: {acceptedCount} trips
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              Rejected: {rejectedCount} trips
            </Badge>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" disabled>
              <Download className="h-4 w-4 mr-2" />
              Download Report (coming soon)
            </Button>
            <Button onClick={handleSubmit} size="lg">
              Submit Decisions
            </Button>
          </div>
        </div>
      </CardContent>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Trip: {selectedTrip?.tripId} - {selectedTrip?.lrNumber}
              </p>
              <Textarea
                placeholder="Add rejection comment..."
                value={rejectionComment}
                onChange={(e) => setRejectionComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
