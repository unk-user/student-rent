import RequestCard from '@/components/RequestCard';
import propTypes from 'prop-types';

function RequestSection({ requests, listing, refetch }) {
  return (
    <div className="w-full mt-24">
      <h4 className="text-lg font-medium pb-2 border-b-2 border-gray-500">
        Posted requests
      </h4>
      <div className="flex flex-col w-full gap-2">
        {requests.length > 0
          ? requests?.map((request) => (
              <RequestCard
                key={request._id}
                request={request}
                listing={listing}
                refetch={refetch}
              />
            ))
          : <p className='text-base py-2'>No requests</p>}
      </div>
    </div>
  );
}

RequestSection.propTypes = {
  requests: propTypes.array,
  listing: propTypes.object,
  refetch: propTypes.func,
};

export default RequestSection;
