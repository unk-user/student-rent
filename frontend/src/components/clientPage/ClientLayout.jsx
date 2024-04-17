import { Outlet } from "react-router-dom";
function ClientRoute() {
  

  return (
    <article className="min-h-screen my-2">
      <Outlet/>
    </article>
  );
}

export default ClientRoute;
