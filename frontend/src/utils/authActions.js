import axios from 'axios';

export const signupAction =
  ({ authContext }) =>
  async ({ request }) => {
    try {
      const formData = await request.formData();
      const userData = Object.fromEntries(formData);
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URI}register`,
        userData,
        { withCredentials: true }
      );
      console.log(response.data);
      authContext.setAuth(response.data);
      return null;
    } catch (error) {
      return { error: error.response.data.message };
    }
  };

export const loginAction =
  ({ authContext }) =>
  async ({ request }) => {
    try {
      const formData = await request.formData();
      const userData = Object.fromEntries(formData);
      const response = await axios.post(
        `${import.meta.env.REACT_APP_API_URI}login`,
        userData,
        { withCredentials: true }
      );
      console.log(response.data);
      authContext.setAuth(response.data);
      return true;
    } catch (error) {
      return { error: error.response.data.message };
    }
  };

export const logout = async () => {
  const response = axios.post(`${import.meta.env.REACT_APP_API_URI}logout`);
  return response;
};
