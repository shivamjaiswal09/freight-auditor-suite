export interface FreightConfig {
  id: string;
  client: string;
  branch: string;
  transporter: string;
  primaryMatchKey: MatchKey;
  fallbackKeys: MatchKey[];
  allowPartialMatch: boolean;
  autoApprove: boolean;
  requireManualReview: boolean;
  allowedDomains?: string;
  acceptedEmails?: string;
}

export type MatchKey = 
  | "Invoice Number"
  | "LR Number"
  | "Trip ID"
  | "Vehicle Number"
  | "Invoice Date";

export interface Trip {
  id: string;
  tripId: string;
  lrNumber: string;
  origin: string;
  destination: string;
  proformaBaseFreight: number;
  invoiceBaseFreight: number;
  proformaAdditionalCharges: number;
  invoiceAdditionalCharges: number;
  status: "Match" | "Mismatch - Base" | "Mismatch - Charges" | "Mismatch - Both";
  decision?: "accepted" | "rejected";
  rejectionComment?: string;
}

export interface AuditSummary {
  totalTrips: number;
  exactMatchCount: number;
  baseFreightDifferences: number;
  additionalChargesDifferences: number;
  totalDifference: number;
  baseDiffAmount: number;
  additionalDiffAmount: number;
}
