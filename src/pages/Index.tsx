import { MetricCard } from "@/components/dashboard/MetricCard";
import { AppointmentsTable } from "@/components/dashboard/AppointmentsTable";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { dadosOperacao, formatTime } from "@/data/dashboardData";
import nexzoRobot from "@/assets/nexzo-robot.png";
import {
  MessageSquare,
  Clock,
  UserPlus,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const Index = () => {
  const latestMetrics = dadosOperacao.metricas_gerais[0];
  const previousMetrics = dadosOperacao.metricas_gerais[1];

  const calculateTrend = (current: number, previous: number) => ({
    value: Math.round(((current - previous) / previous) * 100),
    isPositive: current >= previous,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={nexzoRobot} 
                alt="NEXZO Robot" 
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  NEXZO
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Painel de Monitoramento de Dados de Atendimento
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-success/10 text-success rounded-lg text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Sistema Online
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <MetricCard
            title="Conversas Mensais"
            value={latestMetrics.conversas_mensais}
            icon={MessageSquare}
            variant="primary"
            trend={calculateTrend(
              latestMetrics.conversas_mensais,
              previousMetrics.conversas_mensais
            )}
            delay={0}
          />
          <MetricCard
            title="Tempo Médio"
            value={formatTime(latestMetrics.tempo_medio_s)}
            icon={Clock}
            variant="default"
            delay={50}
          />
          <MetricCard
            title="Novos Leads"
            value={latestMetrics.novos_leads}
            icon={UserPlus}
            variant="success"
            trend={calculateTrend(
              latestMetrics.novos_leads,
              previousMetrics.novos_leads
            )}
            delay={100}
          />
          <MetricCard
            title="Taxa de Sucesso"
            value={`${latestMetrics.taxa_sucesso_percentual}%`}
            icon={TrendingUp}
            variant="primary"
            trend={calculateTrend(
              latestMetrics.taxa_sucesso_percentual,
              previousMetrics.taxa_sucesso_percentual
            )}
            delay={150}
          />
          <MetricCard
            title="Reuniões Agendadas"
            value={latestMetrics.reunioes_agendadas}
            icon={Calendar}
            variant="warning"
            delay={200}
          />
          <MetricCard
            title="Reuniões Concluídas"
            value={latestMetrics.reunioes_concluidas}
            icon={CheckCircle2}
            variant="success"
            delay={250}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={dadosOperacao.metricas_gerais} />
          </div>
          <div>
            <ConversionChart
              agendadas={latestMetrics.reunioes_agendadas}
              concluidas={latestMetrics.reunioes_concluidas}
            />
          </div>
        </div>

        {/* Appointments Table */}
        <AppointmentsTable appointments={dadosOperacao.agendamentos_detalhados} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>Última atualização: {latestMetrics.data_hora}</p>
            <p>Dashboard de Atendimento v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
