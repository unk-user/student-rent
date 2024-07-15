import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="bg-gray-50 flex-1 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
