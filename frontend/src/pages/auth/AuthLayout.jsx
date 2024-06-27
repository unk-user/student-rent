import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function AuthLayout() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  );
}

export default AuthLayout;
