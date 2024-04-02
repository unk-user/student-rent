import { Form, Link } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import ErrorPopup from '../ui/ErrorPopup';

function LoginForm() { 

  return (
      <Form method='post' className="relative border-2 rounded-lg pt-4 pb-2 px-6 w-[400px] flex flex-col items-center">
        <ErrorPopup />
        <div className={`w-full`}>
          <h3>Account</h3>
          <p className="mb-5">
            Login with your email and password.
          </p>
          <div className="grid gap-2 w-full">
            <Input
              name={'email'}
              type="email"
              label={'Email address'}
              placeholder={'example@mail.com'}
              validationMessage={'invalid email'}
              required
            />
            <Input
              name={'password'}
              type={'password'}
              label={'Password'}
              minLength='8'
              maxLength='16'
              placeholder={'your password'}
              required
            />
          </div>
          <div className="mt-6 mb-5">
            <Button
              type="submit"
              className={'w-full block'}
            >
              Login
            </Button>
            <p className="text-center">dont have an account? <Link to='/signup'>signup</Link></p>
          </div>
        </div>
      </Form>
  )
}

export default LoginForm;
