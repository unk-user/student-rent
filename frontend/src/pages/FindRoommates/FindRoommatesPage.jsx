import TransparentLayoutWrapper from '@/components/TransparentLayoutWrapper';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import ProfileSection from './components/ProfileSection';
import OptionBar from './components/OptionBar';
import {
  useLocation,
  useNavigate,
  useOutlet,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import RequestCard from '@/components/RequestCard';
import Pagination from '@/components/Pagination';

function FindRoommatesPage() {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const pathArr = useLocation().pathname.split('/');
  const pathName = pathArr[pathArr.length - 1];
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePagination = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  useEffect(() => {
    if (outlet === null) {
      navigate('./best-matches', { replace: true });
    }
    if (searchParams.page) {
      setSearchParams({ page: 1 });
    }
  }, [outlet, navigate, searchParams, setSearchParams]);

  const requestsQuery = useQuery({
    queryKey: ['getRequests', searchParams.get('page'), pathName],
    queryFn: async () => {
      const queryType = pathName || 'best-matches';
      const { data } = await axiosInstance.get(
        `/client/requests?page=${searchParams.get('page')}&query=${queryType}`
      );
      return data;
    },
  });

  return (
    <TransparentLayoutWrapper>
      <div className="flex max-md:flex-col-reverse gap-4 w-full min-h-full">
        <div className="flex-1">
          <div className="bg-white mb-1">
            <OptionBar />
            <div className="w-full">
              {requestsQuery.isSuccess &&
              requestsQuery.data.requests.length > 0 ? (
                requestsQuery.data.requests.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    refetch={requestsQuery.refetch}
                    withPadding
                  />
                ))
              ) : (
                <div className="text-center py-12">No requests found</div>
              )}
            </div>
          </div>
          <Pagination
            page={parseInt(searchParams.get('page'))}
            setPage={handlePagination}
            totalPages={requestsQuery?.data?.totalPages || 1}
          />
        </div>
        <ProfileSection refetch={requestsQuery.refetch} />
      </div>
    </TransparentLayoutWrapper>
  );
}

export default FindRoommatesPage;
