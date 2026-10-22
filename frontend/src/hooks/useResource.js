import { useCallback, useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';
export default function useResource(path, enabled = true, interval = 0) {
  const [data, setData] = useState(null), [error, setError] = useState(''), [revision, setRevision] = useState(0), [loaded, setLoaded] = useState(false);
  const reload = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    if (!enabled || !path) return;
    const controller = new AbortController(); let pending = false;
    async function load() {
      if (pending) return; pending = true;
      try { const response = await axiosClient.get(path, { signal: controller.signal }); if (!controller.signal.aborted) { setData(response.data); setLoaded(true); setError(''); } }
      catch (err) { if (!controller.signal.aborted) setError(err.response?.data?.message || 'Unable to load data. Please retry.'); }
      finally { pending = false; }
    }
    load(); const timer = interval ? setInterval(load, interval) : null;
    const focus = () => load(); window.addEventListener('focus', focus);
    return () => { controller.abort(); clearInterval(timer); window.removeEventListener('focus', focus); };
  }, [path, enabled, revision, interval]);
  return { data, error, reload, loading: enabled && !loaded && !error };
}
