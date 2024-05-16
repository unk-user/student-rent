import SignupForm from "./SignupForm"
import { useContext, useEffect } from "react";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(auth) {
      return navigate('/');
    }
  }, [auth, navigate]);

  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <SignupForm />
    </main>
  )
}

export default Signup
