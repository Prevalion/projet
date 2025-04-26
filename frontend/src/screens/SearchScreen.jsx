import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Grid,
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider
} from '@mui/material';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

const SearchScreen = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword, pageNumber = 1, category: urlCategory } = useParams();
  const queryParams = new URLSearchParams(window.location.search); // Get query params

  const [keyword, setKeyword] = useState(urlKeyword || '');
  const [category, setCategory] = useState(urlCategory || '');
  const [price, setPrice] = useState(queryParams.get('price') || ''); // Get price from URL
  const [rating, setRating] = useState(queryParams.get('rating') || ''); // Get rating from URL
  const [sortBy, setSortBy] = useState(queryParams.get('sort') || ''); // Add state for sorting, get from URL

  // Update the query hook to include sortBy
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
    price,
    rating,
    sort: sortBy, // Pass sortBy to the query
  });

  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    'Phones',
    'Accessories',
    'Books',
    'Clothing',
    'Beauty',
    'Sports',
    'Home'
  ];

  const priceRanges = [
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 to $100' },
    { value: '100-200', label: '$100 to $200' },
    { value: '200-500', label: '$200 to $500' },
    { value: '500-1000', label: '$500 to $1000' },
    { value: '1000-0', label: 'Above $1000' },
  ];

  const ratingOptions = [
    { value: '4', label: '4 Stars & Up' },
    { value: '3', label: '3 Stars & Up' },
    { value: '2', label: '2 Stars & Up' },
    { value: '1', label: '1 Star & Up' },
  ];

  // Add sorting options
  const sortOptions = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating_desc', label: 'Avg. Customer Rating' },
    { value: '', label: 'Best Match' }, // Default option
  ];

  // Effect to handle navigation when filters/sort change
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (price) params.set('price', price);
    if (rating) params.set('rating', rating);
    if (sortBy) params.set('sort', sortBy); // Add sort to params

    const queryString = params.toString();
    const path = keyword ? `/search/${keyword}` : '/search';

    // Only navigate if the query string or keyword actually changes
    // to avoid unnecessary re-renders or navigation loops
    const currentSearch = window.location.search;
    const currentPath = window.location.pathname;
    const targetPath = `${path}${queryString ? `?${queryString}` : ''}`;
    const currentFullPath = `${currentPath}${currentSearch}`;

    if (targetPath !== currentFullPath) {
       // Using navigate with replace to avoid pushing duplicate entries into history
       // when only filters/sort change without keyword search.
       // If keyword changes, we might want to push instead.
       // For simplicity now, using replace.
       navigate(`${path}${queryString ? `?${queryString}` : ''}`, { replace: true });
       // Optionally refetch data if navigation doesn't trigger it automatically
       // refetch();
    }
    // Dependency array includes all filters and sorting options
  }, [keyword, category, price, rating, sortBy, navigate]);


  const submitHandler = (e) => {
    e.preventDefault();
    // Navigation is now handled by the useEffect hook when keyword changes
    // We might still need this if we want an explicit search button action
    // For now, let useEffect handle navigation based on state changes.
    // Triggering navigation here might conflict with useEffect
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (price) params.set('price', price);
    if (rating) params.set('rating', rating);
    if (sortBy) params.set('sort', sortBy);

    const queryString = params.toString();
    const path = keyword ? `/search/${keyword}` : '/search';
    navigate(`${path}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Meta title={`Search Results${keyword ? ` for "${keyword}"` : ''}`} />

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Search & Filter Products
        </Typography>

        {/* Search Input Form */}
        <Box component="form" onSubmit={submitHandler} sx={{ mb: 3 }}>
           <Grid container spacing={2} alignItems="center">
             <Grid item xs={12} md={6}> {/* Adjusted width */}
               <TextField
                 fullWidth
                 label="Search Products"
                 variant="outlined"
                 value={keyword}
                 onChange={(e) => setKeyword(e.target.value)}
                 placeholder="Search by name or description..."
               />
             </Grid>
             <Grid item xs={12} md={6}> {/* Adjusted width */}
               <Button
                 type="submit"
                 variant="contained"
                 color="primary"
                 fullWidth
                 sx={{ height: '56px' }}
               >
                 Search
               </Button>
             </Grid>
           </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Filter and Sort Controls */}
        <Grid container spacing={2} alignItems="center">
          {/* Category Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Price Range</InputLabel>
              <Select
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                label="Price Range"
              >
                <MenuItem value="">Any Price</MenuItem>
                {priceRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Rating Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Rating</InputLabel>
              <Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                label="Rating"
              >
                <MenuItem value="">Any Rating</MenuItem>
                {ratingOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sorting Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Section */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message severity="error">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {keyword
                ? `Search Results for "${keyword}"`
                : 'Products'}
              { (category || price || rating || sortBy) && ' (Filtered/Sorted)'}
            </Typography>
            <Typography variant="body1">
              {data.products.length} result{data.products.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>

          {data.products.length === 0 ? (
            <Message severity="info">
              No products found matching your criteria. Try adjusting your search or filters.
            </Message>
          ) : (
            <Grid container spacing={3}>
              {data.products.map((product) => (
                <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
                  <Product product={product} />
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ''}
              // Pass filter/sort params to Paginate if needed for links
              // category={category}
              // price={price}
              // rating={rating}
              // sortBy={sortBy}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default SearchScreen;