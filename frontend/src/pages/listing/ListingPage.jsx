import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BookingCard from './BookingCard';
import PreviewImages from '@src/components/PreviewImages';
import Facilities from './Facilities';
import LandlordCard from '@src/components/LandlordCard';
import Reviews from './Reviews';
import useQueryAuth from '@src/hooks/useQueryAuth';

function ListingPage() {
  const { listingId } = useParams();

  const { data, status } = useQueryAuth({
    queryKey: [listingId],
    url: `student/listings/${listingId}`,
    role: 'client',
  });

  const landlordPropertiesNumber = useMemo(
    () => data?.listing && data.listing.landlordId.properties.length,
    [data]
  );

  return (
    <>
      {status === 'success' && (
        <>
          <main className="px-12">
            <header>
              <h2>{data.listing.title}</h2>
              <h5>{data.listing.address}</h5>
            </header>
            <section className="flex w-full gap-2">
              <div className="flex-1">
                <PreviewImages />
                <Facilities listing={data.listing} />
                <LandlordCard
                  name={data.listing.landlordId.userId.username}
                  properties={landlordPropertiesNumber}
                />
              </div>
              <BookingCard listing={data.listing} />
            </section>
            <div>
              <Reviews />
            </div>
          </main>
        </>
      )}
    </>
  );
}

export default ListingPage;
