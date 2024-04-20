import axios from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider';

function ListingPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const { auth, refreshAccessToken } = useContext(AuthContext);
  const [shouldRedirect, setShouldRedirect] = useState(false);

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

  if (shouldRedirect) return <Navigate to="/login" replace/>;

  return <div>{listing && listing.price}</div>;
}

export default ListingPage;
