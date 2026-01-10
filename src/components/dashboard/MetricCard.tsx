import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
  delay?: number;
}

const variantStyles = {
  default: "bg-secondary/50",
  primary: "bg-primary/20 text-primary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
};

export const MetricCard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  delay = 0,
}: MetricCardProps) => {
  return (
    <div
      className="metric-card animate-fade-in p-4 md:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 md:space-y-2 overflow-hidden">
          <p className="metric-label truncate">{title}</p>
          <p className="text-xl md:text-3xl font-bold text-black dark:text-white truncate">{value}</p>
          {trend && (
            <div
              className={cn(
                "flex items-center flex-wrap gap-1 text-[10px] md:text-sm font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span className="flex items-center">
                {trend.isPositive ? "↑" : "↓"}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground hidden sm:inline">vs ontem</span>
            </div>
          )}
        </div>
        <div className={cn("metric-icon shrink-0", variantStyles[variant])}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
    </div>
  );
};
