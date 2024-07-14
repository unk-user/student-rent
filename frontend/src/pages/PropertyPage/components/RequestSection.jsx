import RequestCard from '@/components/RequestCard';
import { Button } from '@material-tailwind/react';
import { PlusSignIcon } from 'hugeicons-react';
import propTypes from 'prop-types';

function RequestSection({ requests, listing, refetch, handleRequestDialog }) {
  return (
    <div className="w-full mt-12">
      <div className="flex items-center justify-between pb-1 border-b-2 border-gray-500">
        <h4 className="text-lg font-medium">Posts</h4>

        <Button
          size="sm"
          className="text-base bg-dark-blue flex items-center gap-1"
          onClick={handleRequestDialog}
        >
          <PlusSignIcon size={20} />
          Create post
        </Button>
      </div>
      <div className="flex flex-col w-full gap-2">
        {requests.length > 0 ? (
          requests?.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              listing={listing}
              refetch={refetch}
            />
          ))
        ) : (
          <p className="text-base py-2">No requests</p>
        )}
      </div>
    </div>
  );
}

RequestSection.propTypes = {
  requests: propTypes.array,
  listing: propTypes.object,
  refetch: propTypes.func,
  handleRequestDialog: propTypes.func,
};

export default RequestSection;
