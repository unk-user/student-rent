import axios from 'axios';
import { redirect } from 'react-router-dom';

const authLoader =
  ({ authContext }) =>
  async () => {
    const { auth, setAuth } = authContext;
    console.log(auth);
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
        console.log('error refreshing access token:', error);
        return redirect('/login');
      }
    }
    return auth;
  };

export default authLoader;
