import RequestCard from '@/components/RequestCard';
import TransparentLayoutWrapper from '@/components/TransparentLayoutWrapper';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

function FindRoommatesPage() {
  const query = useQuery({
    queryKey: ['getRequests'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/client/requests`);
      return data;
    },
  });

  return (
    <TransparentLayoutWrapper>
      <section className="bg-white w-full flex flex-col gap-2 min-h-full">
        <h4 className="text-lg px-2 py-2 border-b-2 border-gray-500">
          Recent Requests
        </h4>
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
    </TransparentLayoutWrapper>
  );
}

export default FindRoommatesPage;
