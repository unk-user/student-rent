import {
  Button,
  Chip,
  Dialog,
  DialogFooter,
  DialogHeader,
  Textarea,
} from '@material-tailwind/react';
import { useState } from 'react';
import propTypes from 'prop-types';
import FormInput from './FormInput';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

function RequestDialog({ open, handler, listingId, refetch, disabled }) {
  const [details, setDetails] = useState({
    roommates: 1,
    totalRoommates: 2,
    message: '',
    preferences: [],
  });
  const [preference, setpreference] = useState('');
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationKey: ['request'],
    mutationFn: async () => {
      const { data } = await axiosInstance.post(
        `/client/requests/${listingId ? listingId : ''}`,
        {
          details: {
            numberOfRoommatesTotal: details.totalRoommates,
            numberOfRoommatesApplied: details.roommates,
            message: details.message,
            preferences: details.preferences,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      handler();
      setDetails({
        roommates: 1,
        totalRoommates: 1,
        message: '',
        preferences: [],
      });
      refetch();
    },
  });

  const addPreference = () => {
    if (
      preference &&
      !details.preferences.includes(preference) &&
      details.preferences.length < 4
    ) {
      setDetails((prev) => {
        return { ...prev, preferences: [...prev.preferences, preference] };
      });
      setpreference('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;
    if (details.roommates >= details.totalRoommates)
      return setError(
        'Total roommates number cannot be less than roommates applied'
      );
    mutation.mutate();
  };

  return (
    <Dialog handler={handler} open={open} className="!font-normal">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="text-xl font-medium pb-0">
          Create post
        </DialogHeader>
        <div className="px-4">
          <p className="text-base text-gray-600 font-normal mb-3">
            Requests help you find roommates.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-3 mb-4">
            <FormInput
              label="Number of roommates needed"
              type="number"
              required={true}
              max={10}
              min={2}
              value={details.totalRoommates}
              onChange={(e) =>
                setDetails({ ...details, totalRoommates: e.target.value })
              }
            />
            <FormInput
              label="Number of roommates applied"
              type="number"
              required={true}
              max={10}
              min={0}
              value={details.roommates}
              onChange={(e) =>
                setDetails({ ...details, roommates: e.target.value })
              }
            />
          </div>
          <p className="mb-1">Message</p>
          <Textarea
            required={true}
            label="Message"
            maxLength={500}
            value={details.message}
            minLength={50}
            onChange={(e) =>
              setDetails({ ...details, message: e.target.value })
            }
          />
          <FormInput
            label="preferences"
            withButton={true}
            value={preference}
            onChange={(e) => setpreference(e.target.value)}
          >
            <Button
              size="sm"
              type="button"
              color="blue"
              variant="outlined"
              className="py-1 rounded-[2px]"
              onClick={addPreference}
              maxLength={15}
            >
              Add
            </Button>
          </FormInput>
          <div className="flex items-center py-2 gap-1">
            {details.preferences.length > 0
              ? details.preferences.map((preference) => (
                  <Chip
                    key={preference}
                    value={preference}
                    size="sm"
                    className="text-sm font-normal bg-gray-500 text-gray-600"
                    onClose={() =>
                      setDetails((prev) => {
                        return {
                          ...prev,
                          preferences: prev.preferences.filter(
                            (p) => p !== preference
                          ),
                        };
                      })
                    }
                  />
                ))
              : ''}
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            loading={mutation.isPending}
            className="w-full text-base bg-dark-blue"
          >
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

RequestDialog.propTypes = {
  open: propTypes.bool,
  handler: propTypes.func,
  listingId: propTypes.string,
  refetch: propTypes.func,
  disabled: propTypes.bool,
};

export default RequestDialog;
