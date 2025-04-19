import React from 'react'; // Added React import
// Removed react-bootstrap imports: Table, Button, Row, Col
// import { Table, Button, Row, Col } from 'react-bootstrap';
import {
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  Grid, // Replaces Row, Col
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, // Used for container styling
  IconButton, // Replaces Button for icons
  Box, // Used for layout
  CircularProgress // Used for loading states
} from '@mui/material';
// import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'; // Replace with MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// Import useNavigate
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom'; // Renamed Link
import Message from '../../components/Message'; // Keep or replace with MUI Alert
import Loader from '../../components/Loader';
import Paginate from '../../components/Paginate';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
// Removed react-router-dom Link import as RouterLink is used

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate(); // Initialize navigate

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) { // Improved confirmation message
      try {
        await deleteProduct(id);
        toast.success('Product deleted'); // Added success toast
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        // Call the mutation and wait for the result
        const createdProduct = await createProduct().unwrap();
        // No need to refetch if navigating away immediately
        refetch(); 
        // Navigate to the edit screen for the new product
        navigate(`/admin/product/${createdProduct._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {/* Replaced Row/Col with Grid */}
      <Grid container alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs>
          {/* Replaced h1 with Typography */}
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Products
          </Typography>
        </Grid>
        <Grid item>
          {/* Replaced react-bootstrap Button with MUI Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={createProductHandler}
            startIcon={<AddIcon />}
            disabled={loadingCreate}
          >
            Create Product
            {loadingCreate && <CircularProgress size={20} sx={{ ml: 1, color: 'white' }} />}
          </Button>
        </Grid>
      </Grid>

      {/* Loaders remain the same, but could be integrated differently */}
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Consider using MUI Alert
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          {/* Replaced react-bootstrap Table with MUI Table components */}
          <TableContainer component={Paper} elevation={1}>
            <Table sx={{ minWidth: 650 }} aria-label="products table">
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>PRICE</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>CATEGORY</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>BRAND</TableCell>
                  <TableCell></TableCell> {/* Empty cell for action buttons */}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.products.map((product) => (
                  <TableRow
                    key={product._id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {product._id}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell align="right">
                      {/* Replaced react-bootstrap Buttons with MUI IconButtons */}
                      <IconButton
                        component={RouterLink}
                        to={`/admin/product/${product._id}/edit`}
                        size="small"
                        sx={{ mr: 1 }} // Add margin right
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteHandler(product._id)}
                        disabled={loadingDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Paginate component */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
             <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          </Box>
        </>
      )}
    </>
  );
};

export default ProductListScreen;
