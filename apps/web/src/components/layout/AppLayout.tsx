import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div>
      <header className="site-header">
        <Link className="brand" to="/">ragebait</Link>
        <nav aria-label="Điều hướng chính">
          <Link to="/#dau-hieu">Dấu hiệu</Link>
          <Link to="/rageshield">Rage Shield AI</Link>
          <Link to="/#so-lieu">Số liệu</Link>
        </nav>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
