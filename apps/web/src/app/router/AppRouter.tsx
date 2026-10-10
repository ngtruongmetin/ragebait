import { Route, Routes } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { HomePage } from '../../features/status/HomePage';
import { NotFoundPage } from '../../features/status/NotFoundPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
