import { useState } from "react";
import { FilterBar } from "@/components/audit/FilterBar";
import { UploadCard } from "@/components/audit/UploadCard";
import { ProcessingLoader } from "@/components/audit/ProcessingLoader";
import { SummaryView } from "@/components/audit/SummaryView";
import { TripTable } from "@/components/audit/TripTable";
import { Trip, AuditSummary } from "@/types/freight";

// Mock data
const mockTrips: Trip[] = [
  {
    id: "1",
    tripId: "TRP-001",
    lrNumber: "LR-2024-0001",
    origin: "Mumbai",
    destination: "Delhi",
    proformaBaseFreight: 50000,
    invoiceBaseFreight: 52000,
    proformaAdditionalCharges: 5000,
    invoiceAdditionalCharges: 5500,
    status: "Mismatch - Both",
  },
  {
    id: "2",
    tripId: "TRP-002",
    lrNumber: "LR-2024-0002",
    origin: "Delhi",
    destination: "Bangalore",
    proformaBaseFreight: 45000,
    invoiceBaseFreight: 45000,
    proformaAdditionalCharges: 4500,
    invoiceAdditionalCharges: 4500,
    status: "Match",
  },
  {
    id: "3",
    tripId: "TRP-003",
    lrNumber: "LR-2024-0003",
    origin: "Bangalore",
    destination: "Chennai",
    proformaBaseFreight: 30000,
    invoiceBaseFreight: 32000,
    proformaAdditionalCharges: 3000,
    invoiceAdditionalCharges: 3000,
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
    const baseFreightDiff = trips.filter(
      t => t.status === "Mismatch - Base" || t.status === "Mismatch - Both"
    ).length;
    
    const chargesDiff = trips.filter(
      t => t.status === "Mismatch - Charges" || t.status === "Mismatch - Both"
    ).length;

    const totalDiff = trips.reduce((sum, trip) => {
      return sum + 
        (trip.invoiceBaseFreight - trip.proformaBaseFreight) +
        (trip.invoiceAdditionalCharges - trip.proformaAdditionalCharges);
    }, 0);

    return {
      totalTrips: trips.length,
      baseFreightDifferences: baseFreightDiff,
      additionalChargesDifferences: chargesDiff,
      totalDifference: totalDiff,
    };
  };

  const canUpload = client && branch && transporter;

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      <FilterBar
        client={client}
        branch={branch}
        transporter={transporter}
        onClientChange={setClient}
        onBranchChange={setBranch}
        onTransporterChange={setTransporter}
      />

      {canUpload && state === "filters" && (
        <UploadCard onProcess={handleProcess} />
      )}

      {state === "upload" && (
        <UploadCard onProcess={handleProcess} />
      )}

      {state === "processing" && <ProcessingLoader />}

      {(state === "summary" || state === "review") && (
        <>
          <SummaryView
            summary={calculateSummary()}
            fileName={fileName}
            onReviewTrips={handleReviewTrips}
          />

          {state === "review" && (
            <div id="trips-table">
              <TripTable trips={trips} onTripsUpdate={setTrips} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
