import { Pagination, PaginationItem } from '@mui/material';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isHome = false, onPageChange, keyword = '' }) => {
  const handleChange = (event, value) => {
    if (isHome && onPageChange) {
      // For home page, use local state change
      onPageChange(value);
    }
    // For search results, navigation happens via Link component
  };

  if (pages <= 1) return null;

  return (
    <Pagination
      count={pages}
      page={page}
      onChange={handleChange}
      color="primary"
      size="large"
      renderItem={(item) => {
        if (isHome) {
          // For home page, render as button without navigation
          return (
            <PaginationItem
              {...item}
              onClick={() => onPageChange && onPageChange(item.page)}
            />
          );
        } else {
          // For search results, render as Link for navigation
          return (
            <PaginationItem
              component={Link}
              to={keyword 
                ? `/search/${keyword}/page/${item.page}`
                : `/page/${item.page}`
              }
              {...item}
            />
          );
        }
      }}
    />
  );
};

export default Paginate;
