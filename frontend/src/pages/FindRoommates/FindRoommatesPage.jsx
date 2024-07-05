import RequestCard from '@/components/RequestCard';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

function FindRoommatesPage() {

  const query = useQuery({
    queryKey: ['getListings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/client/requests`);
      return data;
    },
  });

  return (
    <div className="w-full h-full px-[106px] py-6 max-w-[1432px] mx-auto max-xl:px-8 max-md:px-6 max-sm:px-4">
      <section className="bg-white w-full flex flex-col gap-2 min-h-full">
        <h4 className="text-lg px-2 py-2 border-b-2 border-gray-500">Recent Requests</h4>
        {query.data?.requests?.length > 0 &&
          query.data.requests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              refetch={query.refetch}
              withPadding={true}
            />
          ))}
      </section>
    </div>
  );
}

export default FindRoommatesPage;
