import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "next-themes";

interface ConversionChartProps {
  agendadas: number;
  concluidas: number;
}

export const ConversionChart = ({ agendadas, concluidas }: ConversionChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const colors = {
    success: "hsl(142, 76%, 36%)",
    warning: "hsl(38, 92%, 50%)",
    background: isDark ? "hsl(222, 47%, 8%)" : "hsl(0, 0%, 100%)",
    border: isDark ? "hsl(217, 33%, 17%)" : "hsl(214, 32%, 91%)",
    foreground: isDark ? "hsl(210, 40%, 98%)" : "hsl(222, 47%, 11%)",
  };

  const data = [
    { name: "Concluídas", value: concluidas, color: colors.success },
    { name: "Pendentes", value: agendadas - concluidas, color: colors.warning },
  ];

  const percentage = Math.round((concluidas / agendadas) * 100);

  return (
    <div
      className="bg-card rounded-xl border border-border p-6 animate-fade-in"
      style={{ animationDelay: "350ms" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Taxa de Conclusão
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Reuniões concluídas vs agendadas
        </p>
      </div>
      <div className="h-[200px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                color: colors.foreground,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-foreground">{percentage}%</p>
            <p className="text-xs text-muted-foreground">Sucesso</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Concluídas ({concluidas})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-sm text-muted-foreground">
            Pendentes ({agendadas - concluidas})
          </span>
        </div>
      </div>
    </div>
  );
};
