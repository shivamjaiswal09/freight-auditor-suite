export type MatchKey =
  | "Invoice Number"
  | "LR Number"
  | "Trip ID"
  | "Vehicle Number"
  | "Invoice Date";

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
  allowedSenderDomains?: string;
  acceptedSenderEmails?: string;
}

export type TripStatus = 
  | "Match" 
  | "Mismatch - Base" 
  | "Mismatch - Charges" 
  | "Mismatch - Both";

export type ChargeType = 
  | "Base Freight"
  | "Toll Charges"
  | "Detention Charges"
  | "Loading Charges"
  | "Unloading Charges"
  | "Other Charges";

export interface Charge {
  id: string;
  type: ChargeType;
  contractedAmount: number;
  invoiceAmount: number;
  variance: number;
  decision?: "accepted" | "rejected";
  comment?: string;
}

export interface Trip {
  id: string;
  tripId: string;
  lrNumber: string;
  vehicleNumber?: string;
  origin: string;
  destination: string;
  proformaBaseFreight: number;
  invoiceBaseFreight: number;
  proformaAdditionalCharges: number;
  invoiceAdditionalCharges: number;
  proformaGST?: number;
  invoiceGST?: number;
  status: TripStatus;
  decision?: "accepted" | "rejected";
  comment?: string;
  rejectionComment?: string;
  charges?: Charge[];
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
