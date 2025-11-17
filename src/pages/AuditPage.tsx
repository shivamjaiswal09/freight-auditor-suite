import { useState } from "react";
import { FilterBar } from "@/components/audit/FilterBar";
import { UploadCard } from "@/components/audit/UploadCard";
import { ProcessingLoader } from "@/components/audit/ProcessingLoader";
import { SummaryPanel } from "@/components/audit/SummaryPanel";
import { TripTable } from "@/components/audit/TripTable";
import { Trip, AuditSummary, Charge } from "@/types/freight";
import { Button } from "@/components/ui/button";

// Mock data with detailed charges
const mockCharges: Charge[] = [
  { id: "c1", type: "Base Freight", contractedAmount: 50000, invoiceAmount: 52000, variance: 2000 },
  { id: "c2", type: "Toll Charges", contractedAmount: 2000, invoiceAmount: 2200, variance: 200 },
  { id: "c3", type: "Detention Charges", contractedAmount: 1500, invoiceAmount: 1500, variance: 0 },
  { id: "c4", type: "Unloading Charges", contractedAmount: 1500, invoiceAmount: 1800, variance: 300 },
];

const mockTrips: Trip[] = [
  {
    id: "1",
    tripId: "TRP-001",
    lrNumber: "LR-2024-0001",
    vehicleNumber: "MH-12-AB-1234",
    origin: "Mumbai",
    destination: "Delhi",
    proformaBaseFreight: 50000,
    invoiceBaseFreight: 52000,
    proformaAdditionalCharges: 5000,
    invoiceAdditionalCharges: 5500,
    proformaGST: 9900,
    invoiceGST: 10350,
    status: "Mismatch - Both",
    charges: mockCharges,
  },
  {
    id: "2",
    tripId: "TRP-002",
    lrNumber: "LR-2024-0002",
    vehicleNumber: "DL-01-XY-5678",
    origin: "Delhi",
    destination: "Bangalore",
    proformaBaseFreight: 45000,
    invoiceBaseFreight: 45000,
    proformaAdditionalCharges: 4500,
    invoiceAdditionalCharges: 4500,
    proformaGST: 8910,
    invoiceGST: 8910,
    status: "Match",
  },
  {
    id: "3",
    tripId: "TRP-003",
    lrNumber: "LR-2024-0003",
    vehicleNumber: "KA-03-CD-9012",
    origin: "Bangalore",
    destination: "Chennai",
    proformaBaseFreight: 30000,
    invoiceBaseFreight: 32000,
    proformaAdditionalCharges: 3000,
    invoiceAdditionalCharges: 3000,
    proformaGST: 5940,
    invoiceGST: 6300,
    status: "Mismatch - Base",
  },
];

type AuditState = "filters" | "upload" | "processing" | "summary" | "review";

export const AuditPage = () => {
  const [state, setState] = useState<AuditState>("filters");
  const [client, setClient] = useState("");
  const [branch, setBranch] = useState("");
  const [transporter, setTransporter] = useState("");
  const [fileName, setFileName] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);

  const handleProcess = (file: File) => {
    setFileName(file.name);
    setState("processing");

    // Simulate AI processing
    setTimeout(() => {
      setTrips(mockTrips);
      setState("summary");
    }, 2500);
  };

  const handleReviewTrips = () => {
    setState("review");
    // Scroll to trips table
    setTimeout(() => {
      document.getElementById("trips-table")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const calculateSummary = (): AuditSummary => {
    const exactMatch = trips.filter(t => t.status === "Match").length;
    
    const baseFreightDiff = trips.filter(
      t => t.status === "Mismatch - Base" || t.status === "Mismatch - Both"
    ).length;
    
    const chargesDiff = trips.filter(
      t => t.status === "Mismatch - Charges" || t.status === "Mismatch - Both"
    ).length;

    const baseDiffAmount = trips
      .filter(t => t.status === "Mismatch - Base" || t.status === "Mismatch - Both")
      .reduce((sum, trip) => sum + (trip.invoiceBaseFreight - trip.proformaBaseFreight), 0);

    const additionalDiffAmount = trips
      .filter(t => t.status === "Mismatch - Charges" || t.status === "Mismatch - Both")
      .reduce((sum, trip) => sum + (trip.invoiceAdditionalCharges - trip.proformaAdditionalCharges), 0);

    const totalDiff = trips.reduce((sum, trip) => {
      return sum + 
        (trip.invoiceBaseFreight - trip.proformaBaseFreight) +
        (trip.invoiceAdditionalCharges - trip.proformaAdditionalCharges);
    }, 0);

    return {
      totalTrips: trips.length,
      exactMatchCount: exactMatch,
      baseFreightDifferences: baseFreightDiff,
      additionalChargesDifferences: chargesDiff,
      totalDifference: totalDiff,
      baseDiffAmount,
      additionalDiffAmount,
    };
  };

  const canUpload = client && branch && transporter;

  return (
    <div className="min-h-screen bg-muted/30">
      <FilterBar
        client={client}
        branch={branch}
        transporter={transporter}
        onClientChange={setClient}
        onBranchChange={setBranch}
        onTransporterChange={setTransporter}
        showUploadButton={canUpload && state === "filters"}
        onUploadClick={() => setState("upload")}
      />

      <div className="container mx-auto px-6 py-8 space-y-6">
        {canUpload && state === "filters" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Select client, branch, and transporter to begin, then upload an invoice
            </p>
          </div>
        )}

        {state === "upload" && <UploadCard onProcess={handleProcess} />}

        {state === "processing" && <ProcessingLoader />}

        {(state === "summary" || state === "review") && (
          <>
            <SummaryPanel summary={calculateSummary()} />

            {state === "summary" && (
              <div className="flex justify-center">
                <Button onClick={handleReviewTrips} size="lg" className="px-8">
                  Review Trips
                </Button>
              </div>
            )}

            {state === "review" && (
              <div id="trips-table">
                <TripTable trips={trips} onTripsUpdate={setTrips} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
