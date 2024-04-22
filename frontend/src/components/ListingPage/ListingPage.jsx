import axios from 'axios';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';
import BookingCard from './BookingCard';
import PreviewImages from '../ui/PreviewImages';
import Facilities from './Facilities';
import LandlordCard from '../ui/LandlordCard';
import Reviews from './Reviews';

function ListingPage() {
  const { listingId } = useParams();
  const { auth, refreshAccessToken } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const landlordProperties = useMemo(
    () => listing && listing.landlordId.properties.length
  , [listing]);

  const fetchListing = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.REACT_APP_API_URI}student/listings/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        }
      );
      console.log(response);
      setListing(response.data.listing);
    } catch (error) {
      console.error('error fetching listingData:', error);
    }
  }, [auth, listingId]);

  useEffect(() => {
    const refreshLocalAuth = async () => {
      if (!auth) {
        try {
          const newAuth = await refreshAccessToken();
          console.log(newAuth);
          if (!newAuth) {
            setShouldRedirect(true);
          }
        } catch (error) {
          setShouldRedirect(true);
          console.error(error);
        }
      }
    };

    refreshLocalAuth();
    fetchListing();

    return () => {
      setShouldRedirect(false);
    };
  }, [fetchListing, auth, refreshAccessToken]);

  if (shouldRedirect) return <Navigate to="/login" replace />;

  return (
    <>
      {listing && (
        <>
          <main className="px-12">
            <header>
              <h2>{listing.title}</h2>
              <h5>{listing.address}</h5>
            </header>
            <section className="flex w-full gap-2">
              <div className="flex-1">
                <PreviewImages />
                <Facilities listing={listing} />
                <LandlordCard
                  name={listing.landlordId.userId.username}
                  properties={landlordProperties}
                />
              </div>
              <BookingCard listing={listing} />
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
