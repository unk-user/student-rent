import { IconButton } from '@material-tailwind/react';
import propTypes from 'prop-types';
import { useEffect } from 'react';

function Pagination({ page, setPage, totalPages }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="flex w-full h-8 justify-end gap-1">
      <IconButton
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        size="sm"
        className="rounded-none bg-white text-black h-6 w-6"
      >
        ...
      </IconButton>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) =>
        pageNumber < 5 || (pageNumber > page - 4 && pageNumber <= page) ? (
          <IconButton
            key={pageNumber}
            size="sm"
            disabled={pageNumber === page}
            onClick={() => setPage(pageNumber)}
            className="rounded-none bg-white text-black h-6 w-6"
          >
            {pageNumber}
          </IconButton>
        ) : (
          ''
        )
      )}
      <IconButton
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        size="sm"
        className="rounded-none bg-white text-black h-6 w-6"
      >
        ...
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
