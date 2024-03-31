import Input from '../ui/Input';
import Button from '../ui/Button';
import PropTypes from 'prop-types'

function GeneralForm({formData, handleChange, handleNext}) {
  return (
    <form className="w-full">
      <h3>Welcome to AjiTkri</h3>
      <p className="text-sm mb-4">
        Sign up with your username, email, and password to get started.
      </p>
      <div className="grid grid-cols-2 gap-2 w-full">
        <Input
          name="username"
          label="Full name"
          className="col-start-1 col-end-3"
          required={true}
          placeholder={'Your name'}
          handleChange={handleChange}
          value={formData.username}
        ></Input>
        <Input
          name="email"
          label="Email address"
          type="email"
          value={formData.email}
          placeholder={'Example@mail.com'}
          required={true}
          handleChange={handleChange}
          className="col-start-1 col-end-3"
        ></Input>
        <Input
          name="password"
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
      <div className="my-4">
        <Button
          handleClick={handleNext}
          name="next"
          className="ml-auto block bg-yellow-200"
        >
          Next
        </Button>
      </div>
    </form>
  );
}
export default GeneralForm;

GeneralForm.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  handleNext: PropTypes.func
}