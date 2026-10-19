import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function HashScroller() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
  }, [hash, pathname]);

  return null;
}
