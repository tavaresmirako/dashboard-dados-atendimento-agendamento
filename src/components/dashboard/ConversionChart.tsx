import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface ConversionChartProps {
  agendadas: number;
  concluidas: number;
}

export const ConversionChart = ({ agendadas, concluidas }: ConversionChartProps) => {
  const data = [
    { name: "Concluídas", value: concluidas, color: "hsl(142, 76%, 36%)" },
    { name: "Pendentes", value: agendadas - concluidas, color: "hsl(38, 92%, 50%)" },
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
                backgroundColor: "hsl(222, 47%, 8%)",
                border: "1px solid hsl(217, 33%, 17%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
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
