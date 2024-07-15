import FormInput from '@/components/FormInput';
import axiosInstance from '@/utils/axiosInstance';
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import propTypes from 'prop-types';
import { useState } from 'react';

function PreferencesDialog({ open, handler, initialData, refetch }) {
  const [preferences, setPreferences] = useState(initialData);

  const mutation = useMutation({
    mutationKey: ['updatePreferences'],
    mutationFn: async () => {
      const { data } = await axiosInstance.patch(
        '/client/profile/preferences',
        {
          preferences,
        }
      );

      return data;
    },
    onSuccess: () => {
      refetch();
      handler();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Dialog open={open} handler={handler} className="!font-normal">
      <form onSubmit={handleSubmit}>
        <DialogHeader className="text-xl font-medium pb-0">
          Update preferences
        </DialogHeader>
        <div className="px-4">
          <FormInput
            label="City"
            value={preferences?.city}
            onChange={(e) =>
              setPreferences({ ...preferences, city: e.target.value })
            }
            disabled={mutation.isPending}
          />
          <FormInput
            label="School"
            value={preferences?.school}
            onChange={(e) =>
              setPreferences({ ...preferences, school: e.target.value })
            }
            disabled={mutation.isPending}
          />
          <FormInput
            label="Budget"
            type="number"
            step={50}
            value={parseInt(preferences?.budget)}
            onChange={(e) =>
              setPreferences({ ...preferences, budget: e.target.value })
            }
            disabled={mutation.isPending}
          />
        </div>
        <DialogFooter>
          <Button
            loading={mutation.isPending}
            type="submit"
            className="w-full text-base bg-dark-blue"
          >
            Save
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

PreferencesDialog.propTypes = {
  open: propTypes.bool,
  handler: propTypes.func,
  refetch: propTypes.func,
  initialData: propTypes.object,
};

export default PreferencesDialog;
