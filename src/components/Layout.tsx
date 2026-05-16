import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
