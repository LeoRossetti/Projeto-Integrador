import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DashboardClient, DashboardSnapshot, ResumoSemanal } from '../data/types';
import { getDashboardClient } from '../data/dashboardClient';
import { logWarn, logInfo } from '../utils/observability';

export type DashboardStatus = 'loading' | 'success' | 'error';

export interface UseDashboardData {
  status: DashboardStatus;
  snapshot: DashboardSnapshot | null;
  resumoSemanal: ResumoSemanal[];
  lastUpdated: Date | null;
  connectionLost: boolean;
  error: Error | null;
  refetch: () => void;
}

const POLL_PADRAO_MS = 30_000;

export function useDashboardData(clientArg?: DashboardClient, pollMs: number = POLL_PADRAO_MS): UseDashboardData {
  const client = useMemo(() => clientArg ?? getDashboardClient(), [clientArg]);
  const [status, setStatus] = useState<DashboardStatus>('loading');
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [resumoSemanal, setResumoSemanal] = useState<ResumoSemanal[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionLost, setConnectionLost] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const temDados = useRef(false);
  // ESTUDO: essa variável lembra se a conexão estava caída ou não.
  // Precisa ser useRef (e não useState) pra funcionar dentro do buscar().
  const wasConnectionLost = useRef(false);
  const requestId = useRef(0);

  const buscar = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const [canteiros, leituras, resumo] = await Promise.all([
        client.getCanteiros(),
        client.getLeiturasUltimas(),
        client.getResumoSemanal()
      ]);
      if (id !== requestId.current) return;
      setSnapshot({ canteiros, leituras });
      setResumoSemanal(resumo);
      setLastUpdated(new Date());
      // ESTUDO: se antes tava caído e agora deu certo, avisa nos logs que voltou.
      // Usa logInfo (aviso leve) porque voltar é coisa boa.
      if (wasConnectionLost.current) {
        logInfo('connection.restored');
      }
      wasConnectionLost.current = false;
      setConnectionLost(false);
      setError(null);
      setStatus('success');
      temDados.current = true;
    } catch (e) {
      if (id !== requestId.current) return;
      const err = e instanceof Error ? e : new Error(String(e));
      if (temDados.current) {
        // ESTUDO: só avisa nos logs na PRIMEIRA vez que cai, não toda vez.
        // Usa logWarn (alerta) e não logError, pra não bagunçar a contagem de erros do Sintoma 1.
        // err.message diz o motivo (ex: "Network Error", "timeout").
        if (!wasConnectionLost.current) {
          logWarn('connection.lost', { reason: err.message });
        }
        wasConnectionLost.current = true;
        setConnectionLost(true);
      } else {
        setError(err);
        setStatus('error');
      }
    }
  }, [client]);

  useEffect(() => {
    void buscar();
    const id = setInterval(() => void buscar(), pollMs); // poilling é o sistema perguntando se tem dado novo 
    return () => clearInterval(id);
  }, [buscar, pollMs]);

  return { status, snapshot, resumoSemanal, lastUpdated, connectionLost, error, refetch: buscar };
}
