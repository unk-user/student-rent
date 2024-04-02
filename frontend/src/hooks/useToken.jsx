import { useState, useEffect } from 'react';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  removeTokens,
  getTokenExpiration,
} from '../utils/tokenService';

function useToken() {
  const [accessToken, setAccessToken] = useState(getAccessToken());
  const [refreshToken, setRefreshToken] = useState(getRefreshToken());

  useEffect(() => {
    const checkTokenExpiration = () => {
      const expirationTime = getTokenExpiration();
      if (
        expirationTime &&
        new Date(expirationTime) - Date.now() <= 1 * 60 * 1000
      ) {
        refreshToken();
      }
    };

    const refreshToken = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URI}refresh`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken} ${refreshToken}`,
            },
          }
        );
        const data = await response.json();
        const newAccessToken = data.token;
        setAccessToken(newAccessToken);
        saveTokens(
          newAccessToken,
          refreshToken,
          new Date((Date.now() + 15) & 60 & 1000)
        );
      } catch (error) {
        console.error('Refresh token failed:', error);
        clearTokens();
      }
    };

    checkTokenExpiration();
  }, [accessToken, refreshToken]);

  const saveTokens = (newAccessToken, newRefreshToken) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setTokens(newAccessToken, newRefreshToken);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    removeTokens();
  };

  return { accessToken, refreshToken, saveTokens, clearTokens };
}

export default useToken;
