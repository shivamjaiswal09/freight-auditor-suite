import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { AuditSummary } from "@/types/freight";

interface SummaryViewProps {
  summary: AuditSummary;
  fileName: string;
  onReviewTrips: () => void;
}

export const SummaryView = ({ summary, fileName, onReviewTrips }: SummaryViewProps) => {
  const formatCurrency = (amount: number) => {
    return `₹ ${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Metrics */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Total Trips Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{summary.totalTrips}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-warning" />
              Trips with Base Freight Difference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-foreground">
                {summary.baseFreightDifferences}
              </div>
              <div className="text-sm text-muted-foreground">trips</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Trips with Additional Charges Difference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl font-bold text-foreground">
                {summary.additionalChargesDifferences}
              </div>
              <div className="text-sm text-muted-foreground">trips</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-destructive" />
              Total Difference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive">
              {formatCurrency(summary.totalDifference)}
            </div>
          </CardContent>
        </Card>

        <Button onClick={onReviewTrips} size="lg" className="w-full">
          Review Trips
        </Button>
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
