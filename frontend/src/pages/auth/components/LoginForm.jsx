import { ViewIcon, ViewOffIcon } from 'hugeicons-react';
import { Button, Alert } from '@material-tailwind/react';
import { useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '@/components/FormInput';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';
import { AuthContext } from '@/context/AuthProvider';

function LoginPage() {
  const { setAuth } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
    if (inputRef.current) {
      if (showPassword) {
        inputRef.current.type = 'password';
      } else {
        inputRef.current.type = 'text';
      }
    }
  };

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/client/login', {
        email,
        password,
      });
      return data;
    },
    onSuccess: (data) => {
      setAuth(data);
      navigate('/tenant/rent');
    },
    onError: () => {},
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full p-4 sm:p-0 sm:max-w-[420px] sm:mx-auto my-32"
    >
      {mutation.isError && (
        <Alert
          className="absolute -top-2 left-0 right-0 -translate-y-full text-sm"
          color="red"
          variant="ghost"
        >
          {mutation.error.response.data.message}
        </Alert>
      )}
      <h2 className="text-2xl">Sign in</h2>
      <div className="mt-6 mb-8">
        <FormInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          placeholder="name@mail.com"
          required={true}
        />
        <FormInput
          containerClassName="mt-4"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputRef={inputRef}
          label="Password"
          placeholder="********"
          withButton={true}
          required={true}
          minLength={8}
          maxLength={16}
        >
          {password && (
            <Button
              className="rounded p-1"
              variant="text"
              onClick={togglePassword}
              disabled={!password}
              tabIndex={-1}
            >
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          )}
        </FormInput>
      </div>
      <Button
        className="w-full text-base bg-blue-300"
        size="sm"
        type="submit"
        loading={mutation.isPending}
      >
        Sign in
      </Button>
      <p className="mt-2 text-center">
        Don&apos;t have an account?
        <Link className="text-blue-300 hover:underline" to="../signup">
          {' '}
          Sign up
        </Link>
      </p>
    </form>
  );
}
export default LoginPage;
