import { useState } from 'react';
import { Form, Link } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorPopup from '../../components/ErrorPopup';
import RadioItem from '../../components/RadioItem';
import ComboBox from '../../components/ComboBox';

function SignupForm() {
  const [selectedRole, setSelectedRole] = useState('client');

  const handleRoleSelection = (e) => {
    setSelectedRole(e.target.value);
  };

  const cityData = [
    'Casablanca',
    'Rabat',
    'Fes',
    'Tangier',
    'Marrakesh',
    'Sale',
    'Agadir',
    'Meknes',
    'Oujda',
    'Kenitra',
    'Tetouan',
    'Al Hoceima',
  ];

  return (
    <Form
      className="relative border-2 rounded-lg pt-4 pb-2 px-6 w-[400px] flex flex-col items-center"
      method="post"
    >
      <ErrorPopup />
      <div>
        <h3>Account</h3>
        <p className="mb-5">
          Sign up with your username, email, and password to get started.
        </p>
      </div>
      <div className="grid gap-2 w-full">
        <Input
          name={'username'}
          type="text"
          label={'Full name'}
          placeholder={'your name'}
          required
        />
        <Input
          name={'email'}
          type="email"
          label={'Email address'}
          placeholder={'example@mail.com'}
          required
        />
        <Input
          name={'password'}
          type={'password'}
          label={'Password'}
          minLength="8"
          maxLength="16"
          placeholder={'your password'}
          required
        />
        <div>
          <p className="font-medium">Sign up as</p>
          <div className="flex flex-col mb-2">
            <RadioItem
              label={'Client'}
              name={'role'}
              value={'client'}
              selectedRole={selectedRole}
              handleRoleSelection={handleRoleSelection}
            />
            <RadioItem
              label={'Landlord'}
              name={'role'}
              value={'landlord'}
              selectedRole={selectedRole}
              handleRoleSelection={handleRoleSelection}
            />
          </div>
          <div
            className={`flex flex-col gap-2 relative ${
              selectedRole === 'landlord' && 'opacity-40'
            }`}
          >
            {selectedRole === 'landlord' && (
              <div className="w-full h-full z-30 absolute"></div>
            )}
            <Input
              name={'school'}
              placeholder={'ENSA'}
              label={'Select your school'}
              type="text"
            />
            <div>
              <p className="font-medium mb-1">Select your city</p>
              <ComboBox
                options={cityData}
                name={'city'}
                label={'Select city'}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 mb-5">
          <div className="gap-1 flex flex-col">
            <Button type="submit" className={'w-full'}>
              Sign up
            </Button>
          </div>
          <p className="text-center">
            already have an account? <Link to="/login">login</Link>
          </p>
        </div>
      </div>
    </Form>
  );
}

export default SignupForm;
