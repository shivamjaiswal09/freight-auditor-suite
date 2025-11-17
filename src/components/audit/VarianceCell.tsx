import { cn } from "@/lib/utils";

interface VarianceCellProps {
  variance: number;
  showSign?: boolean;
  className?: string;
}

export const VarianceCell = ({ variance, showSign = true, className }: VarianceCellProps) => {
  const isPositive = variance > 0;
  const isZero = variance === 0;

  const formatCurrency = (amount: number) => {
    return `₹${Math.abs(amount).toLocaleString("en-IN")}`;
  };

  if (isZero) {
    return (
      <span className={cn("text-muted-foreground font-medium", className)}>
        —
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-semibold",
        isPositive ? "text-destructive" : "text-success",
        className
      )}
    >
      {showSign && (isPositive ? "+" : "-")}
      {formatCurrency(variance)}
    </span>
  );
};
