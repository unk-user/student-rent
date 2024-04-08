import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

AuthProvider.propTypes = {
  children: PropTypes.any,
};
