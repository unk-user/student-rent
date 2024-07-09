import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ImagesPreview from './components/ImagesPreview';
import { useEffect, useState } from 'react';
import ImagesPreviewMobile from './components/ImagesPreviewMobile';
import { useMediaQuery } from 'react-responsive';
import RequestDialog from '@/components/RequestDialog';
import ListingHeader from './components/ListingHeader';
import ListingDetails from './components/ListingDetails';
import ActionCard from './components/ActionCard';
import ReviewSection from './components/ReviewSection';
import RequestSection from './components/RequestSection';

function PropertyPage() {
  const { listingId } = useParams();
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeButtonDisabled, setLikeButtonDisabled] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 760px)' });

  const query = useQuery({
    queryKey: ['getListing', listingId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/client/listings/${listingId}`);
      return data;
    },
  });

  const likeMutation = useMutation({
    mutationKey: ['likeListing'],
    mutationFn: async () => {
      if (!liked) {
        const { data } = await axiosInstance.post(
          `/client/listings/${listingId}/like`
        );
        return data;
      } else if (liked) {
        const { data } = await axiosInstance.delete(
          `/client/listings/${listingId}/like`
        );
        return data;
      }
    }
  });

  useEffect(() => {
    if (query.isSuccess) {
      setLiked(!!query.data.listing.liked);
    }
  }, [query]);

  useEffect(() => {
    if (likeMutation.isSuccess) {
      setLiked(likeMutation.data.liked);
    }
  }, [likeMutation]);

  const handleLike = () => {
    if (likeButtonDisabled) return;
    likeMutation.mutate();
    setLikeButtonDisabled(true);

    setTimeout(() => {
      setLikeButtonDisabled(false);
    }, 1000);
  };

  const handleRequestDialog = () => {
    setRequestDialogOpen(!requestDialogOpen);
  };

  return (
    <div className="w-full h-full bg-white">
      {query.status === 'success' && (
        <div className="max-w-[1304px] mx-auto w-full py-8 px-[50px] max-xl:px-10 max-xl:max-w-none max-md:px-8 max-sm:px-2">
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
            <RequestSection
              requests={query.data?.listing.requests}
              listing={query.data?.listing}
              refetch={query.refetch}
            />
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
