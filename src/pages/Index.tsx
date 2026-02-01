import { MetricCard } from "@/components/dashboard/MetricCard";
import { AppointmentsTable } from "@/components/dashboard/AppointmentsTable";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SupportModal } from "@/components/SupportModal";
import { formatTime, dadosOperacao } from "@/data/dashboardData";
import { useGoogleSheets } from "@/hooks/useGoogleSheets";
import newIcon from "@/assets/new-icon.png";
import {
  MessageSquare,
  Clock,
  UserPlus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { data, isLoading, error, refetch, lastUpdated } = useGoogleSheets();

  // Usar dados do Google Sheets ou fallback para dados mockados
  const dashboardData = data || dadosOperacao;
  const latestMetrics = dashboardData.metricas_gerais[0];
  const previousMetrics = dashboardData.metricas_gerais[1] || dashboardData.metricas_gerais[0];

  const calculateTrend = (current: number, previous: number) => ({
    value: previous > 0 ? Math.round(((current - previous) / previous) * 100) : 0,
    isPositive: current >= previous,
  });

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return "Carregando...";
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img 
                src={newIcon} 
                alt="Dashboard Icon" 
                className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-lg"
              />
              <div>
                <h1 className="text-base md:text-xl font-medium text-foreground leading-tight">
                  Dashboard de Atendimento
                </h1>
                <p className="text-xs md:text-sm font-bold text-foreground">
                  NEXZO Automações
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between md:justify-end gap-2 md:gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 mt-1 md:mt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="flex items-center gap-2 h-9 px-2 sm:px-3"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span className="hidden xs:inline">Atualizar</span>
                </Button>
                <SupportModal />
              </div>
              <div className="flex items-center gap-2">
                <div className="px-2 sm:px-3 py-1.5 bg-gray-100 dark:bg-black text-black dark:text-white rounded-lg text-[10px] sm:text-xs md:text-sm font-bold flex items-center gap-2 shadow-sm border border-gray-300 dark:border-gray-700">
                  <span className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'} animate-pulse`} />
                  <span className="whitespace-nowrap">{error ? 'Erro' : 'Online'}</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-destructive">Erro ao carregar dados do Google Sheets</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <p className="text-sm text-muted-foreground">Exibindo dados de exemplo como fallback.</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !data && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando dados do Google Sheets...</p>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {(!isLoading || data) && latestMetrics && (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="lg:col-span-2 w-full overflow-hidden">
                <PerformanceChart data={dashboardData.metricas_gerais} />
              </div>
              <div className="w-full overflow-hidden">
                <ConversionChart
                  agendadas={latestMetrics.reunioes_agendadas}
                  concluidas={latestMetrics.reunioes_concluidas}
                />
              </div>
            </div>

            {/* Appointments Table */}
            <AppointmentsTable appointments={dashboardData.agendamentos_detalhados} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>
              {data ? (
                <>Dados sincronizados: {formatLastUpdated(lastUpdated)}</>
              ) : (
                <>Última atualização: {latestMetrics?.data_hora || 'N/A'}</>
              )}
            </p>
            <p className="flex items-center gap-2">
              {data && <span className="w-2 h-2 rounded-full bg-green-500" />}
              Dashboard de Atendimento v2.0 {data ? '• Google Sheets Conectado' : ''}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
