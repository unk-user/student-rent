import axiosInstance from './axiosInstance';

export const signupAction =
  ({ authContext }) =>
  async ({ request }) => {
    try {
      const formData = await request.formData();
      const userData = Object.fromEntries(formData);
      const response = await axiosInstance.post(`/register`, userData, {
        withCredentials: true,
      });
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
      const response = await axiosInstance.post(`/login`, userData, {
        withCredentials: true,
      });
      console.log(response.data);
      authContext.setAuth(response.data);
      return true;
    } catch (error) {
      return { error: error.response.data.message };
    }
  };

export const logout = async () => {
  const response = axiosInstance.post(`/logout`);
  return response;
};
