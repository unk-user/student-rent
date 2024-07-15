import { useQuery } from '@tanstack/react-query';
import { useMediaQuery } from 'react-responsive';
import ListingCarouselTrack from './ListingCarouselTrack';
import axios from 'axios';

function ListingsCarousel() {
  const isDesktop = useMediaQuery({ query: '(min-width: 1400px)' });

  const listingQuery = useQuery({
    queryKey: ['home-listings-1'],
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.REACT_APP_API_URI}/client/listings/random`
      );
      return data;
    },
  });

  return (
    <div className="max-w-[1432px] mx-auto overflow-hidden mb-24">
      <div className="inline-flex flex-nowrap min-w-[200%] w-max">
        <ListingCarouselTrack
          listings={listingQuery?.data?.listings}
          isDesktop={isDesktop}
        />
        <ListingCarouselTrack
          listings={listingQuery?.data?.listings}
          isDesktop={isDesktop}
        />
      </div>
    </div>
  );
}

export default ListingsCarousel;
