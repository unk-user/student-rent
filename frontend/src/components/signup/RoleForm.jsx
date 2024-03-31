import PropTypes from 'prop-types';
import RadioItem from '../ui/RadioItem';
import ComboBox from '../ui/ComboBox';
import Button from '../ui/Button';
import Input from '../ui/Input';
import useAuthenticate from '@/hooks/useAuthenticate';

export default function RoleForm({
  formData,
  setFormData,
  citiesData,
  handleChange,
  handleRadioChange,
  selectedRadio,
}) {
  const cities = citiesData.map((cityData) => {
    return cityData.city;
  });

  const { serverRegister } = useAuthenticate();

  const handleClick = (e) => {
    e.preventDefault();
    serverRegister(formData);
  }

  return (
    <form className="w-full relative">
      <h3 className="mt-2">Account</h3>
      <p className="w-56 text-sm mb-4">
        Finish registration by setting up your account
      </p>
      <p className="text-sm font-semibold">Select your role</p>
      <div className="flex flex-col ml-2 mb-2">
        <RadioItem
          onChange={handleRadioChange}
          value="client"
          name="role"
          label="Client"
          checked={selectedRadio === 'client'}
        />
        <RadioItem
          onChange={handleRadioChange}
          value="landlord"
          name="role"
          label="Landlord"
          checked={selectedRadio === 'landlord'}
        />
      </div>
      <div
        className={`flex flex-col w-full relative ${
          formData.role === 'landlord' && `opacity-30`
        }`}
      >
        {formData.role === 'landlord' && (
          <div className="absolute w-full h-full z-30"></div>
        )}
        <Input
          label="Select your school"
          type="text"
          name="school"
          id="school"
          maxLength={100}
          placeholder="Ensa"
          value={formData.school}
          onChange={handleChange}
          className="mb-1"
        />
        <label htmlFor="school" className="font-semibold text-sm mb-1">
          Select your city
        </label>
        <ComboBox
          formData={formData}
          setFormData={setFormData}
          cities={cities}
        />
      </div>
      <Button className="w-full my-6" handleClick={handleClick}>Create account</Button>
    </form>
  );
}

RoleForm.propTypes = {
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  handleRadioChange: PropTypes.func,
  selectedRadio: PropTypes.string,
  setFormData: PropTypes.func,
  citiesData: PropTypes.array,
};
