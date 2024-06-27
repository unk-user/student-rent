import { ViewIcon, ViewOffIcon } from 'hugeicons-react';
import { Button } from '@material-tailwind/react';
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '@/components/FormInput';

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef(null);

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

  return (
      <form className="relative w-full p-4 sm:p-0 sm:max-w-[420px] sm:mx-auto my-36">
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
          className="w-full text-base font-normal bg-blue-300"
          size="sm"
          type="submit"
        >
          Sign in
        </Button>
        <p className="mt-2 text-center">
          Don&apos;t have an account?
          <Link className="text-blue-300 hover:underline" to="../signup"> Sign up</Link>
        </p>
      </form>
  );
}
export default LoginPage;
