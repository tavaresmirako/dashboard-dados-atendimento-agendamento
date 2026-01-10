import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricaGeral } from "@/data/dashboardData";
import { useTheme } from "next-themes";

interface PerformanceChartProps {
  data: MetricaGeral[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      data: item.data_hora.split(" ")[0].slice(5),
      conversas: item.conversas_mensais,
      leads: item.novos_leads,
      reunioes: item.reunioes_agendadas,
    }));

  const colors = {
    primary: isDark ? "hsl(142, 70%, 45%)" : "hsl(142, 76%, 36%)",
    secondary: isDark ? "hsl(160, 84%, 39%)" : "hsl(160, 84%, 39%)",
    grid: isDark ? "hsl(150, 25%, 17%)" : "hsl(150, 20%, 91%)",
    text: isDark ? "hsl(150, 20%, 55%)" : "hsl(150, 16%, 47%)",
    background: isDark ? "hsl(150, 30%, 8%)" : "hsl(0, 0%, 100%)",
    border: isDark ? "hsl(150, 25%, 17%)" : "hsl(150, 20%, 91%)",
    foreground: isDark ? "hsl(210, 40%, 98%)" : "hsl(150, 40%, 11%)",
  };

  return (
    <div
      className="bg-card rounded-xl border border-border p-6 animate-fade-in"
      style={{ animationDelay: "300ms" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Desempenho Semanal
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Conversas, leads e reuniões dos últimos dias
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorConversas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={colors.secondary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
            <XAxis
              dataKey="data"
              stroke={colors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={colors.text}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.foreground,
              }}
              labelStyle={{ color: colors.text }}
            />
            <Area
              type="monotone"
              dataKey="conversas"
              stroke={colors.primary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorConversas)"
              name="Conversas"
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke={colors.secondary}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLeads)"
              name="Leads"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Conversas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.secondary }} />
          <span className="text-sm text-muted-foreground">Leads</span>
        </div>
      </div>
    </div>
  );
};
