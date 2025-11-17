import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { AuditSummary } from "@/types/freight";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SummaryViewProps {
  summary: AuditSummary;
  fileName: string;
  onReviewTrips: () => void;
}

export const SummaryView = ({ summary, fileName, onReviewTrips }: SummaryViewProps) => {
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const exactMatchShare = (summary.exactMatchCount / summary.totalTrips) * 100;
  const baseDiffShare = (summary.baseFreightDifferences / summary.totalTrips) * 100;
  const additionalDiffShare = (summary.additionalChargesDifferences / summary.totalTrips) * 100;

  const categories = [
    {
      name: "Exact Match",
      trips: summary.exactMatchCount,
      amount: 0,
      share: exactMatchShare,
      variant: "success" as const,
    },
    {
      name: "Base Freight Difference",
      trips: summary.baseFreightDifferences,
      amount: summary.baseDiffAmount,
      share: baseDiffShare,
      variant: "warning" as const,
    },
    {
      name: "Additional Charges Difference",
      trips: summary.additionalChargesDifferences,
      amount: summary.additionalDiffAmount,
      share: additionalDiffShare,
      variant: "destructive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Compact Summary Card */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Freight Audit Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              Overview of detected trips and their mismatches.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* One-line summary */}
            <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-md text-sm">
              <span className="font-medium">Total Trips: {summary.totalTrips}</span>
              <span className="font-medium">
                Total Difference: <span className="text-destructive">{formatCurrency(summary.totalDifference)}</span>
              </span>
            </div>

            {/* Compact table */}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-9 text-xs">Category</TableHead>
                    <TableHead className="h-9 text-xs text-right">Trips</TableHead>
                    <TableHead className="h-9 text-xs text-right">Amount (₹)</TableHead>
                    <TableHead className="h-9 text-xs text-right">Share of Trips</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.name} className="hover:bg-muted/50">
                      <TableCell className="py-2 text-sm font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="py-2 text-sm text-right">
                        {category.trips}
                      </TableCell>
                      <TableCell className="py-2 text-sm text-right">
                        {category.amount > 0 ? formatCurrency(category.amount) : "—"}
                      </TableCell>
                      <TableCell className="py-2 text-sm text-right">
                        {formatPercentage(category.share)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Button onClick={onReviewTrips} size="lg" className="w-full">
              Review Trips
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* PDF Preview */}
      <Card className="lg:h-full">
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Invoice Preview</span>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border bg-muted/30 flex items-center justify-center h-96">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">{fileName}</p>
              <p className="text-xs text-muted-foreground mt-2">PDF Preview Placeholder</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
