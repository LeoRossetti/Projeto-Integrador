import { render, screen, act, renderHook, waitFor } from '@testing-library/react';
import App from '../App';
import { getObservabilitySnapshot, resetObservability } from '../utils/observability';
import { useDashboardData } from '../hooks/useDashboardData';
import type { DashboardClient } from '../data/types';
import { CANTEIROS_MOCK, LEITURAS_MOCK, RESUMO_SEMANAL_MOCK } from '../data/mocks/fixtures';

test('gera logs estruturados e métricas mínimas no front', async () => {
  resetObservability();
  render(<App />);
  expect(await screen.findByText(/WF-01 — Dashboard Geral/i)).toBeInTheDocument();
  const snapshot = getObservabilitySnapshot();
  console.log('[observability-evidence]', JSON.stringify(snapshot, null, 2));
  expect(snapshot.logs.length).toBeGreaterThan(0);
  expect(Object.keys(snapshot.metrics.pageRenderMs)).toContain('principal');
});

// ESTUDO: Este teste prova que connection.lost e connection.restored são logados.
// Usa um mock que muda de comportamento a cada chamada:
//   1ª chamada → sucede (carga inicial ok, temDados = true)
//   2ª chamada → falha  (polling sem internet → connection.lost)
//   3ª chamada → sucede (internet voltou → connection.restored)
test('emite connection.lost na queda e connection.restored na volta', async () => {
  resetObservability();

  let callCount = 0;

  // ESTUDO: mock que sucede na 1ª e 3ª chamada, falha na 2ª
  const mockClient: DashboardClient = {
    getCanteiros: async () => {
      callCount++;
      if (callCount === 2) throw new Error('Network Error');
      return CANTEIROS_MOCK;
    },
    getLeiturasUltimas: async () => {
      if (callCount === 2) throw new Error('Network Error');
      return LEITURAS_MOCK;
    },
    getResumoSemanal: async () => {
      if (callCount === 2) throw new Error('Network Error');
      return RESUMO_SEMANAL_MOCK;
    },
    getHistoricoLeituras: async () => [],
    getAlertas: async () => [],
    getIrrigacoes: async () => [],
    createCanteiro: async () => CANTEIROS_MOCK[0],
    updateCanteiro: async () => CANTEIROS_MOCK[0],
    deleteCanteiro: async () => {},
  };

  // ESTUDO: pollMs curto (50ms) para o teste não demorar 30s
  const { result } = renderHook(() => useDashboardData(mockClient, 50));

  // 1ª chamada: carga inicial ok
  await waitFor(() => {
    expect(result.current.status).toBe('success');
  });

  // 2ª chamada: polling falha → connection.lost
  await waitFor(() => {
    expect(result.current.connectionLost).toBe(true);
  });

  let snap = getObservabilitySnapshot();
  const lostLog = snap.logs.find(l => l.event === 'connection.lost');
  expect(lostLog).toBeDefined();
  expect(lostLog!.level).toBe('warn');
  expect(lostLog!.meta?.reason).toBe('Network Error');

  // 3ª chamada: internet volta → connection.restored
  await waitFor(() => {
    expect(result.current.connectionLost).toBe(false);
  });

  snap = getObservabilitySnapshot();
  const restoredLog = snap.logs.find(l => l.event === 'connection.restored');
  expect(restoredLog).toBeDefined();
  expect(restoredLog!.level).toBe('info');

  console.log('[connection-observability-evidence]', JSON.stringify(snap, null, 2));
});
