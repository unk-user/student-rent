import { useEffect, useState } from 'react';
import GeneralForm from './GeneralForm';
import RoleForm from './RoleForm';

function SignupForm() {
  const [activeForm, setActiveForm] = useState(0);
  const [selectedRadio, setSelectedRadio] = useState('client');
  const [citiesData, setCitiesData] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    school: '',
    age: '',
    city: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.REACT_APP_API_URI}cities`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCitiesData(data.cities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData()
  }, []);

  const handleRadioChange = (e) => {
    setSelectedRadio(e.target.value);
    setFormData({
      ...formData,
      school: '',
      city: '',
      role: e.target.value,
    });
  };

  const validateForm1 = () => {
    const isValidUsername = /^[a-zA-Z]+ [a-zA-Z]+$/g.test(
      formData.username.trim()
    ); // Regex to validate full name
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/g.test(
      formData.email.trim()
    );
    const isValidPassword = formData.password.length >= 8;
    return isValidUsername && isValidEmail && isValidPassword;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    switch (e.target.name) {
      case 'next':
        if (!validateForm1()) return;
        setActiveForm(1);
    }
  };

  return (
    <div action="" className="relative border-2 rounded-lg pt-4 pb-2 px-6 w-[400px]">
      {activeForm === 0 ? (
        <GeneralForm
          formData={formData}
          handleChange={handleChange}
          handleNext={handleNext}
        />
      ) : (
        <RoleForm
        setActiveForm={setActiveForm}
          setFormData={setFormData}
          formData={formData}
          citiesData={citiesData}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
          selectedRadio={selectedRadio}
        />
      )}
      <p className='text-sm text-center m-auto w-max'>Already have an account? login</p>
    </div>
  );
}

export default SignupForm;
