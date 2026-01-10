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
  status: "scheduled" | "completed" | "cancelled";
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
    },
    {
      data_hora: "2026-01-08 15:30",
      conversas_mensais: 98,
      tempo_medio_s: 28,
      novos_leads: 11,
      taxa_sucesso_percentual: 72,
      reunioes_agendadas: 6,
      reunioes_concluidas: 4
    },
    {
      data_hora: "2026-01-07 15:30",
      conversas_mensais: 105,
      tempo_medio_s: 35,
      novos_leads: 9,
      taxa_sucesso_percentual: 65,
      reunioes_agendadas: 7,
      reunioes_concluidas: 6
    },
    {
      data_hora: "2026-01-06 15:30",
      conversas_mensais: 89,
      tempo_medio_s: 30,
      novos_leads: 12,
      taxa_sucesso_percentual: 70,
      reunioes_agendadas: 5,
      reunioes_concluidas: 3
    },
    {
      data_hora: "2026-01-05 15:30",
      conversas_mensais: 115,
      tempo_medio_s: 27,
      novos_leads: 16,
      taxa_sucesso_percentual: 75,
      reunioes_agendadas: 9,
      reunioes_concluidas: 7
    }
  ],
  agendamentos_detalhados: [
    {
      nome_cliente: "Thiago",
      data: "2026-01-09",
      hora: "15:30",
      servico: "Apresentação",
      telefone: "5515981606793@as.whatsapp.net",
      status: "scheduled",
      tempo_resposta_s: 240
    },
    {
      nome_cliente: "Ana Paula",
      data: "2026-01-09",
      hora: "10:00",
      servico: "Demonstração",
      telefone: "5511987002345@as.whatsapp.net",
      status: "completed",
      tempo_resposta_s: 210
    },
    {
      nome_cliente: "Carlos Silva",
      data: "2026-01-10",
      hora: "14:00",
      servico: "Consultoria",
      telefone: "5521999887766@as.whatsapp.net",
      status: "scheduled",
      tempo_resposta_s: 180
    },
    {
      nome_cliente: "Marina Costa",
      data: "2026-01-08",
      hora: "11:30",
      servico: "Demonstração",
      telefone: "5531988776655@as.whatsapp.net",
      status: "completed",
      tempo_resposta_s: 195
    },
    {
      nome_cliente: "Roberto Alves",
      data: "2026-01-11",
      hora: "09:00",
      servico: "Apresentação",
      telefone: "5541977665544@as.whatsapp.net",
      status: "scheduled",
      tempo_resposta_s: 160
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
