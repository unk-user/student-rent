import useToken from "./useToken";

export default function useAuthenticate() {
  const { saveTokens } = useToken();
  
  const registerUser = async (userData) => {
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
        const errorData = await response.json();
        return { error: errorData.message || 'Registrayion failed'};
      }
      const data = await response.json();
      const { token, refreshToken, tokenExpiration } = data;
      if (!token || !refreshToken) {
        return { error: 'Failed to get Tokens' };
      }
      saveTokens(token, refreshToken, tokenExpiration);
      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { error: 'Registration failed' }
    }
  };

  const loginUser = async (userData) => {
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
        const errorData = await response.json();
        return { error: errorData.message || 'Login failed' };
      }
      const data = await response.json();
      const { token, refreshToken, tokenExpiration } = data;
      if (!token || !refreshToken) {
        return { error: 'Failed to get tokens' };
      }
      saveTokens(token, refreshToken, tokenExpiration);
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { error: 'Login failed' }
    }
  };

  return { registerUser, loginUser };
}
