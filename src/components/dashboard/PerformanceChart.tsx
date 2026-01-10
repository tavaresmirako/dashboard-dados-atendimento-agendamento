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

interface PerformanceChartProps {
  data: MetricaGeral[];
}

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const chartData = data
    .slice()
    .reverse()
    .map((item) => ({
      data: item.data_hora.split(" ")[0].slice(5),
      conversas: item.conversas_mensais,
      leads: item.novos_leads,
      reunioes: item.reunioes_agendadas,
    }));

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
                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
            <XAxis
              dataKey="data"
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(215, 20%, 55%)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
              labelStyle={{ color: "hsl(215, 20%, 55%)" }}
            />
            <Area
              type="monotone"
              dataKey="conversas"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorConversas)"
              name="Conversas"
            />
            <Area
              type="monotone"
              dataKey="leads"
              stroke="hsl(142, 76%, 36%)"
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
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Leads</span>
        </div>
      </div>
    </div>
  );
};
