import { useState, useEffect, useCallback } from "react";
import { MetricaGeral, Agendamento, DadosOperacao } from "@/data/dashboardData";

const METRICAS_SHEET_ID = "1RpAyvAB93XML4g2lPUp1QXc89id7B_HSn36UaDAi9nw";
const AGENDAMENTOS_SHEET_ID = "1gg5QMbr1OEDSFhSZkanmTRnB29Bju0zfCn5RKN99NR4";

const getSheetUrl = (sheetId: string) =>
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

const parseCSV = (csv: string): string[][] => {
  const lines = csv.trim().split("\n");
  return lines.map((line) => {
    const values: string[] = [];
    let current = "";
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') insideQuotes = !insideQuotes;
      else if (char === "," && !insideQuotes) {
        values.push(current.trim());
        current = "";
      } else current += char;
    }
    values.push(current.trim());
    return values;
  });
};

const parseMetricas = (csv: string): MetricaGeral[] => {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ""; });
    const getNum = (possibleKeys: string[]) => {
      const key = possibleKeys.find(k => obj[k] !== undefined);
      if (!key) return 0;
      return parseFloat(obj[key].replace(/[^\d,.]/g, "").replace(",", ".")) || 0;
    };
    return {
      data_hora: obj["Data/Hora"] || obj["Data"] || "",
      conversas_mensais: getNum(["Conversas Mensais"]),
      tempo_medio_s: getNum(["Tempo Médio (s)", "Tempo Médio"]),
      novos_leads: getNum(["Novos Leads"]),
      taxa_sucesso_percentual: getNum(["Taxa de Sucesso (%)", "Taxa de Sucesso"]),
      reunioes_agendadas: getNum(["Reuniões Agendadas"]),
      reunioes_concluidas: getNum(["Reuniões Concluídas"]),
    };
  }).filter(m => m.data_hora);
};

const parseAgendamentos = (csv: string): Agendamento[] => {
  const rows = parseCSV(csv);
  if (rows.length < 2) return [];
  const headers = rows[0].map(h => h.trim());
  
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = row[i] || ""; });

    // Mapeamento exato baseado no CSV real
    const rawTempo = obj["Tempo de Resposta"] || "0";
    const tempoResposta = rawTempo.toLowerCase().includes("auto") ? 0 : (parseInt(rawTempo) || 0);

    const rawStatus = obj["Status"] || "Agendado";
    let normalizedStatus = rawStatus;
    
    const lowerStatus = rawStatus.toLowerCase().trim();
    if (lowerStatus === "reagendado" || lowerStatus === "rescheduled") {
      normalizedStatus = "Reagendado";
    } else if (lowerStatus === "concluído" || lowerStatus === "completed") {
      normalizedStatus = "Concluído";
    } else if (lowerStatus === "cancelado" || lowerStatus === "cancelled") {
      normalizedStatus = "Cancelado";
    } else if (lowerStatus === "agendado" || lowerStatus === "scheduled") {
      normalizedStatus = "Agendado";
    } else {
      normalizedStatus = rawStatus;
    }

    return {
      nome_cliente: obj["Cliente"] || "",
      data: obj["Data"] || "",
      hora: obj["Hora"] || "",
      servico: obj["Serviço"] || "",
      telefone: obj["Telefone"] || "",
      status: normalizedStatus,
      tempo_resposta_s: tempoResposta,
    };
  }).filter(a => a.nome_cliente);
};

export const useGoogleSheets = () => {
  const [data, setData] = useState<DadosOperacao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const ts = Date.now();
      const [resM, resA] = await Promise.all([
        fetch(`${getSheetUrl(METRICAS_SHEET_ID)}&t=${ts}`),
        fetch(`${getSheetUrl(AGENDAMENTOS_SHEET_ID)}&t=${ts}`),
      ]);
      const [csvM, csvA] = await Promise.all([resM.text(), resA.text()]);
      setData({
        metricas_gerais: parseMetricas(csvM),
        agendamentos_detalhados: parseAgendamentos(csvA),
      });
    } catch (err) {
      setError("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, isLoading, error, refetch: fetchData };
};
