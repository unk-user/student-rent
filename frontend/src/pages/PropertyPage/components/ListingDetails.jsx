import DetailsItem from './DetailsItems';
import {
  Bathtub01Icon,
  BedSingle01Icon,
  CheckmarkCircle02Icon,
  SquareIcon,
} from 'hugeicons-react';
import propTypes from 'prop-types';

function ListingDetails({ details }) {
  return (
    <div className="col-span-3">
      <div className="flex items-center gap-6">
        <DetailsItem label="Bedrooms" icon={<BedSingle01Icon />}>
          {details?.rooms}
        </DetailsItem>
        <DetailsItem label="Bathrooms" icon={<Bathtub01Icon />}>
          {details?.bathrooms}
        </DetailsItem>
        <DetailsItem label="Square area" icon={<SquareIcon />}>
          {details?.area} m&sup2;
        </DetailsItem>
        <DetailsItem label="Status" icon={<CheckmarkCircle02Icon />}>
          Active
        </DetailsItem>
      </div>
      <div className="w-full mt-5">
        <h4 className="text-lg font-medium">About this property</h4>
        <p className="text-gray-600">{details?.about}</p>
      </div>
    </div>
  );
}

ListingDetails.propTypes = {
  details: propTypes.object,
};

export default ListingDetails;
