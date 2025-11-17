import { AuditSummary } from "@/types/freight";
import { KPICard } from "./KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, AlertTriangle, DollarSign, FileText } from "lucide-react";

interface SummaryPanelProps {
  summary: AuditSummary;
}

export const SummaryPanel = ({ summary }: SummaryPanelProps) => {
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
    },
    {
      name: "Base Freight Difference",
      trips: summary.baseFreightDifferences,
      amount: summary.baseDiffAmount,
      share: baseDiffShare,
    },
    {
      name: "Additional Charges Difference",
      trips: summary.additionalChargesDifferences,
      amount: summary.additionalDiffAmount,
      share: additionalDiffShare,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Trips"
          value={summary.totalTrips}
          icon={FileText}
          variant="default"
        />
        <KPICard
          title="Base Freight Mismatch"
          value={summary.baseFreightDifferences}
          icon={TrendingUp}
          variant="warning"
          subtitle={formatCurrency(summary.baseDiffAmount)}
        />
        <KPICard
          title="Additional Charges Mismatch"
          value={summary.additionalChargesDifferences}
          icon={AlertTriangle}
          variant="warning"
          subtitle={formatCurrency(summary.additionalDiffAmount)}
        />
        <KPICard
          title="Total Difference"
          value={formatCurrency(summary.totalDifference)}
          icon={DollarSign}
          variant="destructive"
        />
      </div>

      {/* Breakdown Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Audit Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="text-right font-semibold">Trips</TableHead>
                <TableHead className="text-right font-semibold">Amount (₹)</TableHead>
                <TableHead className="text-right font-semibold">Share of Trips</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.name} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-right">{category.trips}</TableCell>
                  <TableCell className="text-right">
                    {category.amount > 0 ? formatCurrency(category.amount) : "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatPercentage(category.share)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
