import { useLoaderData, Navigate } from 'react-router-dom';

function RootComponent() {
  const auth = useLoaderData();

  if(auth.role === 'landlord') return <Navigate to='/landlord'/>
  if(auth.role === 'client') return <Navigate to='/client'/>
}

export default RootComponent;
