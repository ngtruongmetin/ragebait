import { useCallback, useEffect, useState } from 'react';
import { fetchHealth, type HealthStatus } from './statusService';

type State = { kind: 'loading' } | { kind: 'success'; data: HealthStatus } | { kind: 'error' };

export function HealthStatusCard() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const check = useCallback(() => {
    setState({ kind: 'loading' });
    void fetchHealth().then(
      (data) => setState({ kind: 'success', data }),
      () => setState({ kind: 'error' }),
    );
  }, []);
  useEffect(() => {
    let mounted = true;
    void fetchHealth().then(
      (data) => mounted && setState({ kind: 'success', data }),
      () => mounted && setState({ kind: 'error' }),
    );
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="status-panel" aria-live="polite">
      <p className="eyebrow">System status</p>
      {state.kind === 'loading' && <p>Checking API connection...</p>}
      {state.kind === 'success' && (
        <>
          <p className="status-ok">API connected</p>
          <small>Verified {new Date(state.data.timestamp).toLocaleTimeString()}</small>
        </>
      )}
      {state.kind === 'error' && (
        <>
          <p className="status-error">API unavailable</p>
          <button type="button" onClick={() => void check()}>
            Try again
          </button>
        </>
      )}
    </section>
  );
}
