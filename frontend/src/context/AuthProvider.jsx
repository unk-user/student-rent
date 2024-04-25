import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const refreshAccessToken = async () => {
    const response = await axiosInstance.post(`/refresh`);
    const newAuth = response.data;
    setAuth(newAuth);
    return newAuth;
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
