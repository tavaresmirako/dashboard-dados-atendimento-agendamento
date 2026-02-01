// Dados baseados no JSON fornecido pelo usuário
export interface MetricaGeral {
  data_hora: string;
  conversas_mensais: number;
  tempo_medio_s: number;
  novos_leads: number;
  taxa_sucesso_percentual: number;
  reunioes_agendadas: number;
  reunioes_concluidas: number;
}

export interface Agendamento {
  nome_cliente: string;
  data: string;
  hora: string;
  servico: string;
  telefone: string;
  status: string; // Alterado para string para aceitar qualquer valor da planilha
  tempo_resposta_s: number;
}

export interface DadosOperacao {
  metricas_gerais: MetricaGeral[];
  agendamentos_detalhados: Agendamento[];
}

export const dadosOperacao: DadosOperacao = {
  metricas_gerais: [
    {
      data_hora: "2026-01-09 15:30",
      conversas_mensais: 120,
      tempo_medio_s: 32,
      novos_leads: 14,
      taxa_sucesso_percentual: 68,
      reunioes_agendadas: 8,
      reunioes_concluidas: 5
    }
  ],
  agendamentos_detalhados: [
    {
      nome_cliente: "Thiago",
      data: "2026-01-09",
      hora: "15:30",
      servico: "Apresentação",
      telefone: "5515981606793@as.whatsapp.net",
      status: "Agendado",
      tempo_resposta_s: 240
    },
    {
      nome_cliente: "Ana Paula",
      data: "2026-01-09",
      hora: "10:00",
      servico: "Demonstração",
      telefone: "5511987002345@as.whatsapp.net",
      status: "Concluído",
      tempo_resposta_s: 210
    },
    {
      nome_cliente: "Carlos Silva",
      data: "2026-01-10",
      hora: "14:00",
      servico: "Consultoria",
      telefone: "5521999887766@as.whatsapp.net",
      status: "Reagendado",
      tempo_resposta_s: 180
    }
  ]
};

// Função para formatar telefone do WhatsApp
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace("@as.whatsapp.net", "");
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  return cleaned;
};

// Função para formatar data
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

// Função para formatar tempo em segundos
export const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};
