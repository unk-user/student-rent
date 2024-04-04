import { useState, useEffect } from 'react';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  getTokenExpiration,
  getUserRole
} from '../utils/tokenService';

function useToken() {
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());
  const [refreshRetries, setRefreshRetries] = useState(0);

  useEffect(() => {
    console.log('calling hook');
    const checkTokenExpiration = () => {
      const expirationTime = getTokenExpiration();
      console.log(expirationTime)
      if (
        expirationTime &&
        expirationTime - Date.now() <= 1 * 60 * 1000
      ) {
        tokenRefrech();
      }
    };

    const tokenRefrech = async () => {
      console.log('trying to refresh')
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URI}refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken} ${refreshToken}`,
            },
          }
        );
        const data = await response.json();
        const newAccessToken = data.token;
        if(!newAccessToken) {
          console.log('invalid access token')
        }
        setAccessToken(newAccessToken);
        saveTokens(
          newAccessToken,
          refreshToken,
          (Date.now() + 15 * 60 * 1000),
          getUserRole()
        );
      } catch (error) {
        console.error('Refresh token failed:', error);
        console.log(refreshRetries)
        setRefreshRetries((refreshRetries) => refreshRetries + 1)
        if(refreshRetries > 4) {
          setRefreshRetries(0);
          clearTokens();
        }
      }
    };

    checkTokenExpiration();
  });

  const saveTokens = (newAccessToken, newRefreshToken, expirationTime, role) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setTokens(newAccessToken, newRefreshToken, expirationTime, role);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    removeTokens();
  };

  return { accessToken, refreshToken, saveTokens, clearTokens };
}

export default useToken;
