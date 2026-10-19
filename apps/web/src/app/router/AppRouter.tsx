import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { HomePage } from '../../features/status/HomePage';
import { RageShieldPage } from '../../features/rageShield/RageShieldPage';
import { NotFoundPage } from '../../features/status/NotFoundPage';
import { HashScroller } from './HashScroller';

export function AppRouter() {
  return (
    <>
      <HashScroller />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="rageshield" element={<RageShieldPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
