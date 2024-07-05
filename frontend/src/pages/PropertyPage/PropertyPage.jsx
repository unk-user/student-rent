import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ImagesPreview from './components/ImagesPreview';
import { useState } from 'react';
import ImagesPreviewMobile from './components/ImagesPreviewMobile';
import { useMediaQuery } from 'react-responsive';
import RequestDialog from '@/components/RequestDialog';
import ListingHeader from './components/ListingHeader';
import ListingDetails from './components/ListingDetails';
import ActionCard from './components/ActionCard';
import ReviewSection from './components/ReviewSection';

function PropertyPage() {
  const { listingId } = useParams();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 760px)' });

  const query = useQuery({
    queryKey: ['getListing', listingId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/client/listings/${listingId}`);
      return data;
    },
    onSuccess: (data) => {
      setLiked(!!data?.listing?.liked);
    },
  });

  const likeMutation = useMutation({
    mutationKey: ['likeListing'],
    mutationFn: async (type) => {
      if (type === 'like') {
        const { data } = await axiosInstance.post(
          `/client/listings/${listingId}/like`
        );
        return data;
      } else if (type === 'unlike') {
        const { data } = await axiosInstance.delete(
          `/client/listings/${listingId}/like`
        );
        return data;
      }
    },
  });

  const handleLike = () => {
    if (liked) {
      likeMutation.mutate('unlike');
      setLiked(false);
    } else {
      likeMutation.mutate('like');
      setLiked(true);
    }
  };

  const handleRequestDialog = () => {
    setRequestDialogOpen(!requestDialogOpen);
  };

  return (
    <div className="w-full h-full bg-white">
      {query.status === 'success' && (
        <div className="max-w-[1304px] mx-auto w-full py-8 px-[50px] max-xl:px-10 max-xl:max-w-none max-md:px-8">
          <div className="w-full flex flex-col gap-3">
            <ListingHeader
              liked={liked}
              handleLike={handleLike}
              details={query.data?.listing.details}
            />
            {isMobile ? (
              <ImagesPreviewMobile
                images={query.data?.listing.details.images}
              />
            ) : (
              <ImagesPreview images={query.data?.listing.details.images} />
            )}
            <div className="w-full grid grid-cols-5 max-sm:grid-cols-1 gap-4 mt-2">
              <ListingDetails details={query.data?.listing.details} />
              <ActionCard
                listing={query.data?.listing}
                handleRequestDialog={handleRequestDialog}
              />
            </div>
            <ReviewSection
              listing={query.data?.listing}
              listingId={listingId}
              refetch={query.refetch}
            />
          </div>
          <RequestDialog
            listingId={listingId}
            refetch={query.refetch}
            open={requestDialogOpen}
            handler={handleRequestDialog}
          />
        </div>
      )}
    </div>
  );
}

export default PropertyPage;
