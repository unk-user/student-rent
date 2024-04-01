import Input from '../ui/Input';
import Button from '../ui/Button';
import { useState } from 'react';
import useAuthenticate from '@/hooks/useAuthenticate';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [invalidFields, setInvalidFields] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { serverLogin, success } = useAuthenticate();
  const navigate = useNavigate();

  const validateForm = () => {
    const updatedInvalidFields = [];

    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/g.test(formData.email.trim()) &&
      updatedInvalidFields.push({
        field: 'email',
      });

    if (formData.password.length < 8)
      updatedInvalidFields.push({ field: 'password' });

    setInvalidFields(updatedInvalidFields);
    return updatedInvalidFields.length === 0;
  };

  const handleClick = async () => {
    if (!validateForm()) return;
    const newMessage = await serverLogin(formData);
    setResponseMessage(newMessage.message);
    if (success) navigate('/private', { replace: true });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative border-2 rounded-lg pt-4 pb-2 px-6 w-[400px] flex flex-col items-center">
      <form action="" className="w-full">
        <h3>Account login</h3>
        <p className="text-sm mb-4">
          Login in with your email and password or create a new account
        </p>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Input
            invalidFields={invalidFields}
            name="email"
            validationMessage="invalid email format"
            label="Email address"
            validateForm={validateForm}
            type="email"
            value={formData.email}
            placeholder={'Example@mail.com'}
            required={true}
            handleChange={handleChange}
            className="col-start-1 col-end-3"
          ></Input>
          <Input
            invalidFields={invalidFields}
            validateForm={validateForm}
            name="password"
            validationMessage="invalid password"
            label="Password"
            type="password"
            placeholder={'Pick a strong password'}
            minLength="8"
            maxLength="16"
            required={true}
            value={formData.password}
            handleChange={handleChange}
            className="col-start-1 col-end-3"
          ></Input>
        </div>
        <div className="mt-6">
          <Button
            handleClick={handleClick}
            name="next"
            className={`w-full block ${success && 'opacity-40'}`}
          >
            Next
          </Button>
          <p className="text-sm text-center mb-4">
            Create a new account? Sign up
          </p>
        </div>
        <p className="text-center text-sm text-red-800 font-semibold">
          {responseMessage}
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
