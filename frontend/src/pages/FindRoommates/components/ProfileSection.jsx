import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import defaultProfile from '@/assets/blank-profile-picture-973460.svg';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthProvider';
import { Button } from '@material-tailwind/react';
import PreferencesSection from './PreferencesSection';
import RequestDialog from '@/components/RequestDialog';
import propTypes from 'prop-types';
import { PlusSignIcon } from 'hugeicons-react';

function ProfileSection({ refetch }) {
  const { auth } = useContext(AuthContext);
  const [postDialogOpen, setPostDialogOpen] = useState(false);

  const userDataQuery = useQuery({
    queryKey: ['getUserData'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/client/profile`);
      return data.client;
    },
  });

  const postDialogHandler = () => {
    setPostDialogOpen(!postDialogOpen);
  };

  return (
    <div className="w-[340px] h-max flex flex-col max-md:w-full gap-3">
      <div className="p-3 bg-white max-md:flex max-sm:block max-md:items-center">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-600 overflow-hidden">
            <img
              src={auth?.user?.profilePicture?.url || defaultProfile}
              alt="profile-picture"
            />
          </div>
          <div>
            <p className="text-lg underline">
              {auth?.user?.firstName +
                ' ' +
                auth?.user?.lastName.split('')[0].toUpperCase() +
                '.'}
            </p>
            <p className="text-base">{auth?.user?.email}</p>
          </div>
        </div>
        <Button
          size="sm"
          className="text-base w-full max-md:w-auto max-md:ml-auto max-sm:mt-2 max-sm:w-full mt-3 max-md:mt-0 bg-dark-blue flex items-center gap-1"
          onClick={postDialogHandler}
        >
          <PlusSignIcon size={20} />
          Create post
        </Button>
      </div>
      <div className="bg-white p-3">
        <PreferencesSection
          preferences={userDataQuery?.data?.preferences}
          refetch={userDataQuery.refetch}
        />
      </div>
      <RequestDialog
        open={postDialogOpen}
        handler={postDialogHandler}
        listingId={null}
        refetch={refetch}
      />
    </div>
  );
}

ProfileSection.propTypes = {
  refetch: propTypes.func.isRequired,
};

export default ProfileSection;
