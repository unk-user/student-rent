import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import { AuthContext } from '@/context/AuthProvider';
import axiosInstance from '@/utils/axiosInstance';
import { Alert, Button, Checkbox } from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { ViewIcon, ViewOffIcon } from 'hugeicons-react';
import { useContext, useReducer, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const citiesArray = [
  'Agadir',
  'Al Hoceima',
  'Azrou',
  'Beni Mellal',
  'Boujdour',
  'Casablanca',
  'Chefchaouen',
  'Dakhla',
  'El Jadida',
  'Errachidia',
  'Essaouira',
  'Fes',
  'Guelmim',
  'Ifrane',
  'Kenitra',
  'Khenifra',
  'Khouribga',
  'Laayoune',
  'Larache',
  'Marrakech',
  'Meknes',
  'Mohammedia',
  'Nador',
  'Ouarzazate',
  'Oujda',
  'Rabat',
  'Safi',
  'Sale',
  'Sefrou',
  'Settat',
  'Sidi Kacem',
  'Tangier',
  'Tan-Tan',
  'Taza',
  'Tetouan',
  'Tiznit',
];

function RegisterPage() {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [userData, setUserData] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'firstName':
          return { ...state, firstName: action.value };
        case 'lastName':
          return { ...state, lastName: action.value };
        case 'email':
          return { ...state, email: action.value };
        case 'password':
          return { ...state, password: action.value };
        case 'city':
          return { ...state, city: action.value };
        case 'reset':
          return { ...state, firstName: '', lastName: '', email: '', city: '' };
      }
    },
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      city: '',
    }
  );
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

  const mutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const { data } = await axiosInstance.post('/client/register', userData);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data);
      navigate('/rent');
    },
    onError: () => {},
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (agree) mutation.mutate();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full p-4 md:p-0 sm:max-w-[600px] sm:mx-auto my-32"
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
      <h2 className="text-2xl">Register</h2>
      <div className="mt-6 mb-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-2">
          <FormInput
            label="First name"
            placeholder="firstname"
            value={userData.firstName}
            onChange={(e) =>
              setUserData({ type: 'firstName', value: e.target.value })
            }
            required={true}
          />
          <FormInput
            label="Last name"
            placeholder="lastname"
            value={userData.lastName}
            onChange={(e) =>
              setUserData({ type: 'lastName', value: e.target.value })
            }
            required={true}
          />
        </div>
        <FormInput
          label="Email"
          placeholder="name@gmail.com"
          type="email"
          required={true}
          value={userData.email}
          onChange={(e) =>
            setUserData({ type: 'email', value: e.target.value })
          }
          containerClassName="mt-4"
        />
        <FormInput
          label="Password"
          placeholder="********"
          type="password"
          inputRef={inputRef}
          required={true}
          value={userData.password}
          onChange={(e) =>
            setUserData({ type: 'password', value: e.target.value })
          }
          minLength={8}
          maxLength={16}
          withButton={true}
          containerClassName="mt-4"
        >
          {userData.password && (
            <Button
              className="rounded p-1"
              variant="text"
              onClick={togglePassword}
              disabled={!userData.password}
              tabIndex={-1}
            >
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          )}
        </FormInput>
        <FormSelect
          containerClassName="my-4"
          value={userData.city ? userData.city : citiesArray[0]}
          onChange={(e) => setUserData({ type: 'city', value: e.target.value })}
          label="City"
          options={citiesArray}
          required={true}
          placeholder="select a city"
        />
        <Checkbox
          containerProps={{
            className: 'p-0 !rounded-[4px] -mt-5 !w-[24px] !overflow-visible',
          }}
          labelProps={{ className: '!text-base !font-normal ml-2 w-fit' }}
          value={agree}
          onChange={(e) => setAgree(e.target.value)}
          color="blue"
          label={
            <p>
              Yes, I understand and agree to the{' '}
              <span className="text-blue-300 hover:underline">
                UROOM Terms of Service
              </span>
              , including the{' '}
              <span className="text-blue-300 hover:underline">
                User Agreement
              </span>
              and{' '}
              <span className="text-blue-300 hover:underline">
                Privacy Policy
              </span>
              .
            </p>
          }
        />
      </div>
      <div className="w-full flex">
        <Button
          className="max-w-[280px] flex-1 mx-auto text-base bg-blue-300"
          size="sm"
          type="submit"
        >
          Sign up
        </Button>
      </div>
      <p className="mt-2 text-center">
        Already have an account?
        <Link className="text-blue-300 hover:underline" to="../signin">
          {' '}
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterPage;
