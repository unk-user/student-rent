import axiosInstance from '@/utils/axiosInstance';
import { Button, Rating } from '@material-tailwind/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ArrowLeft01Icon,
  Bathtub01Icon,
  BedSingle01Icon,
  CheckmarkCircle02Icon,
  FavouriteIcon,
  Share08Icon,
  SquareIcon,
} from 'hugeicons-react';
import { Link, useParams } from 'react-router-dom';
import ImagesPreview from './components/ImagesPreview';
import DetailsItem from './components/DetailsItems';
import Review from './components/Review';
import { useState } from 'react';
import ReviewDialog from './components/ReviewDialog';
import ImagesPreviewMobile from './components/ImagesPreviewMobile';
import { useMediaQuery } from 'react-responsive';

function PropertyPage() {
  const { listingId } = useParams();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
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

  const handleReviewDialog = () => {
    if (query.data?.listing.reviewed) return setReviewDialogOpen(false);
    setReviewDialogOpen(!reviewDialogOpen);
  };

  return (
    <div className="w-full h-full bg-white">
      {query.status === 'success' && (
        <div className="max-w-[1304px] mx-auto w-full py-8 px-[50px] max-xl:px-10 max-xl:max-w-none max-md:px-8">
          <div className="w-full flex flex-col gap-3">
            <div>
              <Link
                to={-1}
                className="flex items-center w-max gap-[1px] text-sm font-medium text-blue-300 opacity-80 hover:opacity-100"
              >
                <ArrowLeft01Icon size={20} />
                Back
              </Link>
              <h2 className="text-2xl">{query.data?.listing.details.title}</h2>
              <div className="flex items-center w-full">
                <p className="text-base text-gray-600">
                  {query.data?.listing.details.location}
                </p>
                <Button
                  variant="outlined"
                  size="sm"
                  className="rounded-[6px] ml-auto flex items-center gap-1 text-blue-300 border-gray-500 font-medium"
                >
                  <Share08Icon size={20} />
                  Share
                </Button>
                <Button
                  onClick={handleLike}
                  variant="outlined"
                  size="sm"
                  className={
                    'rounded-[6px] flex ml-2 items-center gap-1 text-blue-300 border-gray-500 font-medium' +
                    (liked ? ' bg-blue-200' : '')
                  }
                >
                  <FavouriteIcon
                    className={liked ? 'fill-blue-300' : ''}
                    size={20}
                  />
                  Favourite
                </Button>
              </div>
            </div>
            {query.status === 'success' && isMobile ? (
              <ImagesPreviewMobile
                images={query.data?.listing.details.images}
              />
            ) : (
              <ImagesPreview images={query.data?.listing.details.images} />
            )}
            <div className="w-full grid grid-cols-5 max-sm:grid-cols-1 gap-4 mt-2">
              <div className="col-span-3">
                <div className="flex items-center gap-6">
                  <DetailsItem label="Bedrooms" icon={<BedSingle01Icon />}>
                    {query.data?.listing.details.rooms}
                  </DetailsItem>
                  <DetailsItem label="Bathrooms" icon={<Bathtub01Icon />}>
                    {query.data?.listing.details.bathrooms}
                  </DetailsItem>
                  <DetailsItem label="Square area" icon={<SquareIcon />}>
                    {query.data?.listing.details.area} m&sup2;
                  </DetailsItem>
                  <DetailsItem label="Status" icon={<CheckmarkCircle02Icon />}>
                    Active
                  </DetailsItem>
                </div>
                <div className="w-full mt-5">
                  <h4 className="text-lg font-medium">About this property</h4>
                  <p className="text-gray-600">
                    {query.data?.listing.details.about}
                  </p>
                </div>
              </div>
              <div className="col-span-2 h-full border-2 py-2 px-3 border-gray-400">
                <div className="flex items-center">
                  <p>Rent Price</p>
                  <p className="ml-auto text-lg max-md:text-base font-medium text-blue-300">
                    {query.data?.listing.details.price}DH/month
                  </p>
                </div>
                <Link className="w-max text-gray-600 hover:text-black transition-colors duration-200 flex items-center mt-2">
                  <div className="w-10 h-10 bg-gray-500 rounded-full overflow-hidden">
                    {query.data?.listing.landlord.profilePicture && (
                      <img
                        src={query.data?.listing.landlord.profilePicture.url}
                        className="w-full h-full object-cover"
                        alt="profile"
                      />
                    )}
                  </div>
                  <p className="ml-2">
                    {query.data?.listing.landlord.firstName}{' '}
                    {query.data?.listing.landlord.lastName}
                  </p>
                </Link>
                <Button className="w-full text-base rounded-[6px] mt-2 bg-dark-blue">
                  Request
                </Button>
              </div>
            </div>
            <div className="w-full mt-24">
              <h4 className="text-lg font-medium">Reviews and ratings</h4>
              <div className="flex items-center pb-2 border-b-2 border-gray-500">
                <div className="text-lg mr-1 text-white bg-blue-500 p-[1px]">
                  {parseFloat(
                    query.data?.listing.interactionSummary.reviewAvg
                  ).toFixed(1)}
                </div>
                <Rating
                  value={query.data?.listing.interactionSummary.reviewAvg}
                  ratedColor="blue"
                  readonly
                />
                <p className="ml-2 text-gray-600">
                  Based on {query.data?.listing.interactionSummary.reviewCount}{' '}
                  review
                  {query.data?.listing.interactionSummary.reviewCount > 1
                    ? 's'
                    : ''}
                </p>
                <Button
                  size="sm"
                  className="ml-auto text-sm rounded-[6px] bg-blue-300"
                  onClick={handleReviewDialog}
                >
                  {!query.data?.listing.reviewed
                    ? 'Leave a review'
                    : 'Reviewed'}
                </Button>
                <ReviewDialog
                  disabled={!!query.data?.listing.reviewed}
                  open={reviewDialogOpen}
                  handler={handleReviewDialog}
                  listingId={listingId}
                  refetchListing={query.refetch}
                />
              </div>
              <div className="grid grid-cols-4 max-xl:gap-1 max-md:grid-cols-2 gap-3 py-3">
                {query.data?.listing.reviews.map((review) => (
                  <Review key={review._id} review={review} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyPage;
