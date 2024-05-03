import { useParams } from 'react-router-dom';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import CategorySelect from '../ui/CategorySelect';
import { useReducer, useState } from 'react';
import Textarea from '../ui/Textarea';
import useQueryAuth from '../../hooks/useQueryAuth';
import ImageInput from './ImageInput';

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

function EditProperty() {
  const { propertyId } = useParams();
  const url = propertyId ? `landlord/listings/${propertyId}` : undefined;

  const { data, status } = useQueryAuth({
    queryKey: ['listing', url],
    url,
    role: 'landlord',
  });

  const listing = data?.rentalListing || undefined;

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [propertyDetails, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'SET_TITLE':
          return {
            ...state,
            title: action.value,
          };
        case 'SET_DESCRIPTION':
          return {
            ...state,
            description: action.value,
          };
        case 'SET_ADDRESS':
          return {
            ...state,
            address: action.value,
          };
        case 'SET_CITY':
          return {
            ...state,
            city: action.value,
          };
        case 'SET_PRICE':
          return {
            ...state,
            price: action.value,
          };
        case 'SET_PERIOD':
          return {
            ...state,
            period: action.value,
          };
        case 'SET_ROOMS':
          return {
            ...state,
            rooms: action.value,
          };
        case 'SET_BATHROOMS':
          return {
            ...state,
            bathrooms: action.value,
          };
        case 'SET_CATEGORY':
          return {
            ...state,
            category: action.value,
          };
      }
    },
    {
      title: listing?.title || '',
      description: listing?.description || '',
      address: listing?.address || '',
      city: listing?.city || '',
      price: listing?.price || '',
      period: listing?.period || 'monthly',
      rooms: listing?.rooms || 1,
      bathrooms: listing?.bathrooms || 1,
      category: listing?.category || null,
    }
  );



  return (
    <main className="px-12 py-4 flex justify-center gap-24">
      <section className="border w-fit px-8 py-4 pb-24 rounded-xl bg-slate-400 mb-24">
        <div className="mb-8">
          <h3>Add new listing</h3>
          <p>
            Ready to add your property? Let&apos;s begin by entering the
            required information.
          </p>
        </div>
        <form action="">
          <Input
            label={'Property name'}
            value={propertyDetails.title}
            onChange={(e) =>
              dispatch({ type: 'SET_TITLE', value: e.target.value })
            }
            placeholder={listing?.title || 'anything you wish'}
          />
          <div className="grid grid-cols-2 items-end gap-x-4 gap-y-1 mt-1 mb-4">
            <Input
              label={'Address'}
              value={propertyDetails.address}
              onChange={(e) =>
                dispatch({ type: 'SET_ADDRESS', value: e.target.value })
              }
              placeholder={listing?.address || 'Neighborhood, Street Number'}
            />
            <Input
              label={'Price'}
              onChange={(e) =>
                dispatch({ type: 'SET_PRICE', value: e.target.value })
              }
              value={propertyDetails.price}
              placeholder={listing?.price || 'choose a price'}
            />
            <Select
              label="City"
              onChange={(e) =>
                dispatch({ type: 'SET_CITY', value: e.target.value })
              }
              selected={propertyDetails.city}
              placeholder="Select a city"
              options={citiesArray}
            />
            <Select
              label="Payment period"
              onChange={(e) =>
                dispatch({ type: 'SET_PERIOD', value: e.target.value })
              }
              selected={propertyDetails.period}
              options={['Monthly', 'Yearly', 'Semester']}
            />
          </div>
          <CategorySelect
            handleChange={(value) => dispatch({ type: 'SET_CATEGORY', value })}
            value={propertyDetails.category}
          />
          <div className="grid grid-cols-2 items-end gap-x-4 gap-y-1 mt-4">
            <Select
              label={'Bedrooms'}
              onChange={(e) =>
                dispatch({ type: 'SET_ROOMS', value: e.target.value })
              }
              options={['1', '2', '3', '4', '5', 'more']}
              selected={propertyDetails.rooms}
            />
            <Select
              label={'Bathrooms'}
              onChange={(e) =>
                dispatch({ type: 'SET_BATHROOMS', value: e.target.value })
              }
              options={['1', '2', '3', '4', '5', 'more']}
              selected={propertyDetails.bathrooms}
            />
          </div>
          <Textarea
            label="description"
            name="description"
            onChange={(e) =>
              dispatch({ type: 'SET_DESCRIPTION', value: e.target.value })
            }
            value={propertyDetails.description}
            maxLength="500"
            placeholder={listing?.description || null}
            minLength="50"
            className="mt-1"
          />
        </form>
      </section>
      <section className="w-[700px] mb-24">
        <div className="border sticky top-[4.75rem] rounded-lg bg-slate-400 h-4/5 gap-8 py-2 px-8 flex flex-col">
          <ImageInput
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />
          <div className="flex gap-1">
            <Button className="w-2/3">Publish</Button>
            <Button className="flex-1">Cancel</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default EditProperty;
