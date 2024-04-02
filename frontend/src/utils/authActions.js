import { redirect } from 'react-router-dom';

export const signupAction =
  ({ registerUser }) =>
  async ({ request }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const response = await registerUser(updates);

    if (response.error) {
      return { error: response.error };
    }
    return redirect('/');
  };

export const loginAction =
  ({ loginUser }) =>
  async ({ request }) => {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);
    const response = await loginUser(updates);

    if (response.error) {
      return { error: response.error };
    }
    return redirect('/');
  };
