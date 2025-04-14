import { Pagination, PaginationItem, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={pages}
          page={page}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${item.page}`
                    : `/page/${item.page}`
                  : `/admin/productlist/${item.page}`
              }
              {...item}
            />
          )}
        />
      </Box>
    )
  );
};

export default Paginate;
