import { Grid, Button, Typography, Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { useMemo, useState } from 'react';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  
  // Local state for home page pagination
  const [currentHomePage, setCurrentHomePage] = useState(1);

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  // Shuffle products using useMemo for performance optimization
  const shuffledProducts = useMemo(() => {
    if (!data?.products) return [];
    
    // Create a copy to avoid mutating the original cache data
    const productsCopy = [...data.products];
    
    // Fisher-Yates (Knuth) Shuffle Algorithm
    for (let i = productsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
    }
    
    return productsCopy;
  }, [data?.products]);

  // For home page, show 8 products per page in 2x4 grid with local pagination
  const displayProducts = useMemo(() => {
    if (!data?.products) return [];
    
    // If we're on home page (no keyword), use local pagination
    if (!keyword) {
      const productsPerPage = 8;
      const startIndex = (currentHomePage - 1) * productsPerPage;
      const endIndex = startIndex + productsPerPage;
      return data.products.slice(startIndex, endIndex);
    }
    
    // For search results, show all products from API response (server pagination)
    return data.products;
  }, [data?.products, currentHomePage, keyword]);

  // Calculate total pages for home page
  const totalPages = useMemo(() => {
    if (!data?.products || keyword) return data?.pages || 1;
    return Math.ceil(data.products.length / 8);
  }, [data?.products, data?.pages, keyword]);

  // Handle page change for home page
  const handleHomePageChange = (page) => {
    setCurrentHomePage(page);
    // Scroll to top of products section
    document.querySelector('#products-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Reset home page when data changes
  useMemo(() => {
    if (!keyword) {
      setCurrentHomePage(1);
    }
  }, [data?.products, keyword]);

  // Handle loading state
  if (isLoading) {
    return (
      <Container sx={{ py: 4 }}>
        <Meta />
        <Loader />
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Meta />
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      </Container>
    );
  }

  // Handle empty products state
  if (!data?.products || data.products.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Meta />
        {keyword && (
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="primary"
            sx={{ mb: 4 }}
          >
            Go Back
          </Button>
        )}
        <Message variant="info">
          {keyword 
            ? `No products found for "${keyword}"`
            : 'No products available'
          }
        </Message>
      </Container>
    );
  }

  return (
    <>
      <Meta />
      
      {/* Product Carousel Section - Only show on home page (no keyword) */}
      {!keyword && (
        <Box
          sx={{
            mb: 4,
            width: '100vw',
            position: 'relative',
            left: '50%',
            transform: 'translateX(-50.4%)',
            overflow: 'hidden',
          }}
        >
          <ProductCarousel products={shuffledProducts} />
        </Box>
      )}

      {/* Back Button - Only show when searching */}
      {keyword && (
        <Container>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            color="primary"
            sx={{ mb: 4 }}
            startIcon={<span>←</span>}
          >
            Go Back
          </Button>
        </Container>
      )}

      {/* Products Grid Section - 2x4 Layout with Fixed Dimensions */}
      <Box id="products-section" sx={{ bgcolor: '#f5f5f5', py: 4 }}>
        <Container>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              mb: 4,
              color: '#2c2c2c',
              fontWeight: 600,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {keyword ? `Search Results for "${keyword}"` : 'Latest Products'}
          </Typography>

          {/* 2x4 Grid Layout with Consistent Dimensions */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {displayProducts.map((product) => (
              <Grid 
                item 
                key={product._id} 
                xs={12} 
                sm={6} 
                md={3} 
                lg={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'stretch', // Ensures all items stretch to same height
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 280, // Fixed maximum width
                    height: 420, // Fixed height for all product cards
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Product 
                    product={product} 
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Pagination Slider */}
          {totalPages > 1 && (
            <Box 
              sx={{ 
                mt: 5, 
                display: 'flex', 
                justifyContent: 'center',
                borderTop: '1px solid #e0e0e0',
                pt: 4,
              }}
            >
              {!keyword ? (
                // Local pagination for home page
                <Paginate
                  pages={totalPages}
                  page={currentHomePage}
                  isHome={true}
                  onPageChange={handleHomePageChange}
                />
              ) : (
                // Server pagination for search results
                <Paginate
                  pages={totalPages}
                  page={parseInt(pageNumber) || 1}
                  keyword={keyword}
                />
              )}
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default HomeScreen;
