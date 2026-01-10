import { useState, useEffect, useCallback } from "react";
import { MetricaGeral, Agendamento, DadosOperacao } from "@/data/dashboardData";

// IDs das planilhas do Google Sheets
const METRICAS_SHEET_ID = "1RpAyvAB93XML4g2lPUp1QXc89id7B_HSn36UaDAi9nw";
const AGENDAMENTOS_SHEET_ID = "1gg5QMbr1OEDSFhSZkanmTRnB29Bju0zfCn5RKN99NR4";

// URL base para exportar CSV do Google Sheets
const getSheetUrl = (sheetId: string) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

// Parser de CSV simples
const parseCSV = (csv: string): string[][] => {
  const lines = csv.trim().split("\n");
  return lines.map((line) => {
    const values: string[] = [];
    let current = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
};

// Normalizar header removendo acentos, parênteses e espaços
const normalizeHeader = (header: string): string => {
  return header
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[()%]/g, "") // remove parênteses e %
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .trim();
};

// Converter CSV de métricas gerais para o formato esperado
const parseMetricas = (csv: string): MetricaGeral[] => {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });

    // Mapeia os nomes das colunas da planilha para os campos esperados
    return {
      data_hora: obj.data_hora || obj.data || "",
      conversas_mensais: parseInt(obj.conversas_mensais) || 0,
      tempo_medio_s: parseInt(obj.tempo_medio_s) || parseInt(obj.tempo_medio) || 0,
      novos_leads: parseInt(obj.novos_leads) || 0,
      taxa_sucesso_percentual: parseFloat(obj.taxa_sucesso_percentual) || parseFloat(obj.taxa_de_sucesso) || 0,
      reunioes_agendadas: parseInt(obj.reunioes_agendadas) || 0,
      reunioes_concluidas: parseInt(obj.reunioes_concluidas) || 0,
    };
  }).filter(m => m.data_hora); // Filtra linhas vazias
};

// Converter CSV de agendamentos para o formato esperado
const parseAgendamentos = (csv: string): Agendamento[] => {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || "";
    });

    // Mapeia os nomes das colunas da planilha para os campos esperados
    const nomeCliente = obj.nome_do_cliente || obj.nome_cliente || obj.cliente || obj.nome || "";
    const telefone = obj.telefone || obj.phone || obj.tel || "";

    // Mapeia status para os valores esperados
    let status: "scheduled" | "completed" | "cancelled" = "scheduled";
    const rawStatus = (obj.status || "").toLowerCase();
    if (rawStatus.includes("complet") || rawStatus.includes("conclu")) {
      status = "completed";
    } else if (rawStatus.includes("cancel")) {
      status = "cancelled";
    }

    return {
      nome_cliente: nomeCliente,
      data: obj.data || "",
      hora: obj.hora || obj.horario || "",
      servico: obj.servico || "",
      telefone: telefone,
      status,
      tempo_resposta_s: parseInt(obj.tempo_de_resposta_s) || parseInt(obj.tempo_resposta_s) || parseInt(obj.tempo_resposta) || 0,
    };
  }).filter(a => a.nome_cliente); // Filtra linhas vazias
};

export interface UseGoogleSheetsResult {
  data: DadosOperacao | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useGoogleSheets = (): UseGoogleSheetsResult => {
  const [data, setData] = useState<DadosOperacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Buscar ambas as planilhas em paralelo
      const [metricasResponse, agendamentosResponse] = await Promise.all([
        fetch(getSheetUrl(METRICAS_SHEET_ID)),
        fetch(getSheetUrl(AGENDAMENTOS_SHEET_ID)),
      ]);

      if (!metricasResponse.ok || !agendamentosResponse.ok) {
        throw new Error("Erro ao buscar dados das planilhas. Verifique se estão públicas.");
      }

      const [metricasCsv, agendamentosCsv] = await Promise.all([
        metricasResponse.text(),
        agendamentosResponse.text(),
      ]);

      const metricas = parseMetricas(metricasCsv);
      const agendamentos = parseAgendamentos(agendamentosCsv);

      if (metricas.length === 0 && agendamentos.length === 0) {
        throw new Error("Nenhum dado encontrado nas planilhas.");
      }

      setData({
        metricas_gerais: metricas,
        agendamentos_detalhados: agendamentos,
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Erro ao buscar Google Sheets:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    lastUpdated,
  };
};
