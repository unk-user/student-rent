import { IconButton } from '@material-tailwind/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react';
import propTypes from 'prop-types';

function Pagination({ page, setPage, totalPages }) {
  return (
    <div className="flex w-full h-8 justify-end gap-1">
      <IconButton
        size="sm"
        className="rounded-none bg-white text-black h-6 w-6"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ArrowLeft01Icon />
      </IconButton>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <IconButton
          key={pageNumber}
          size="sm"
          disabled={pageNumber === page}
          onClick={() => setPage(pageNumber)}
          className="rounded-none bg-white text-black h-6 w-6"
        >
          {pageNumber}
        </IconButton>
      ))}
      <IconButton
        size="sm"
        className="rounded-none bg-white text-black h-6 w-6"
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
      >
        <ArrowRight01Icon />
      </IconButton>
    </div>
  );
}

Pagination.propTypes = {
  page: propTypes.number.isRequired,
  setPage: propTypes.func.isRequired,
  totalPages: propTypes.number.isRequired,
};

export default Pagination;
