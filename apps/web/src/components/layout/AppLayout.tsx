import { Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div>
      <header className="site-header">
        <a className="brand" href="#ragebait">
          ↯ ragebait
        </a>
        <nav aria-label="Primary navigation">
          <a href="#dau-hieu">Dấu hiệu</a>
          <a href="#rage-shield">Rage Shield</a>
          <a href="#so-lieu">Số liệu</a>
        </nav>
        <a className="head-cta" href="#rage-shield">
          Xem cẩm nang
        </a>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
