import { Navigate, useLoaderData } from 'react-router-dom'
import { getUserRole } from '../utils/tokenService';

function RootComponent() {
  const isAuthenticated = useLoaderData();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace/>
  }
  const userRole = getUserRole();
  
  return (
    <div>
      {
        userRole === 'landlord' ? (
          <div>Authenticated landlord</div>
        ) : (
          <Navigate to='/client'/>
        )
      }
    </div>
  )
}

export default RootComponent
