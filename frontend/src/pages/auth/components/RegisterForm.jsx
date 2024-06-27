import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';

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
  return (
    <form className="relative w-full p-4 sm:p-0 sm:max-w-[600px] sm:mx-auto mt-36 mb-96">
      <h2 className="text-2xl">Register</h2>
      <div className="mt-6 mb-8">
        <div className="grid md:grid-cols-2 md:gap-2">
          <FormInput label="First name" />
          <FormInput label="Last name" />
        </div>
        <FormInput label="Email" />
        <FormInput label="Password" />
        <FormSelect
          label="City"
          options={citiesArray}
          required={true}
          placeholder="select a city"
        />
      </div>
    </form>
  );
}

export default RegisterPage;
