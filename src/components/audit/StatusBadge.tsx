import { Badge } from "@/components/ui/badge";
import { Trip } from "@/types/freight";

interface StatusBadgeProps {
  status: Trip["status"];
  size?: "sm" | "default";
}

export const StatusBadge = ({ status, size = "default" }: StatusBadgeProps) => {
  const getVariant = () => {
    switch (status) {
      case "Match":
        return "default";
      case "Mismatch - Base":
        return "secondary";
      case "Mismatch - Charges":
        return "secondary";
      case "Mismatch - Both":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getClassName = () => {
    const baseClass = size === "sm" ? "text-xs" : "";
    switch (status) {
      case "Match":
        return `${baseClass} bg-success/10 text-success hover:bg-success/20 border-success/20`;
      case "Mismatch - Base":
        return `${baseClass} bg-warning/10 text-warning hover:bg-warning/20 border-warning/20`;
      case "Mismatch - Charges":
        return `${baseClass} bg-warning/10 text-warning hover:bg-warning/20 border-warning/20`;
      case "Mismatch - Both":
        return `${baseClass} bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20`;
      default:
        return baseClass;
    }
  };

  const getLabel = () => {
    switch (status) {
      case "Match":
        return "Matched";
      case "Mismatch - Base":
        return "Base Mismatch";
      case "Mismatch - Charges":
        return "Charges Mismatch";
      case "Mismatch - Both":
        return "Unmatched";
      default:
        return status;
    }
  };

  return (
    <Badge variant={getVariant()} className={getClassName()}>
      {getLabel()}
    </Badge>
  );
};
