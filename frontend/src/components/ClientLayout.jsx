import { Outlet } from 'react-router-dom';
function ClientLayout() {
  return (
    <article className="min-h-screen my-2">
      <Outlet />
    </article>
  );
}

export default ClientLayout;
