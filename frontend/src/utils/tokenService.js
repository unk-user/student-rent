import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const setTokens = (access_token, refreshToken, tokenExpiration) => {
  Cookies.set(ACCESS_TOKEN_KEY, access_token);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
  Cookies.set('token_expiration', tokenExpiration);
}


export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);
export const getTokenExpiration = () => Cookies.get('token_expiration');

export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}