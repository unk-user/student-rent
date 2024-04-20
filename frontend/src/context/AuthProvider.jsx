import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const refreshAccessToken = async () => {
    if (!auth) {
      try {
        const response = await axios.post(
          `${import.meta.env.REACT_APP_API_URI}refresh`,
          { withCredentials: true }
        );
        const newAuth = response.data;
        setAuth(newAuth);
        return newAuth;
      } catch (error) {
        console.error('error refreshing access token:', error);
        return null;
      }
    }
    return auth;
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

AuthProvider.propTypes = {
  children: PropTypes.any,
};
