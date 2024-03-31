import useToken from './useToken';

const useAuthenticate = () => {
  const { saveTokens } = useToken();

  const serverRegister = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URI}register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error('registration failed');
      }
      const data = await response.json();
      const { token, refreshToken, tokenExpiration } = data;
      if (!token || !refreshToken) {
        throw new Error('failed to get tokens');
      }
      saveTokens(token, refreshToken, tokenExpiration);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const serverLogin = async (userData) => {
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URI}login`,
        {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error('registration failed');
      }
      const data = await response.json();
      const { token, refreshToken, tokenExpiration } = data;
      if (!token || !refreshToken) {
        throw new Error('failed to get tokens');
      }
      saveTokens(token, refreshToken, tokenExpiration);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return { serverLogin, serverRegister };
};

export default useAuthenticate;
