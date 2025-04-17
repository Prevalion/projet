import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'; // Renamed Link
// Removed react-bootstrap imports: Form, Button
// import { Form, Button } from 'react-bootstrap';
import {
  Box, // Used for layout
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  TextField, // Replaces Form.Control
  CircularProgress, // Used for loading states
  Link, // MUI Link component
  Input, // Can be used for file input
} from '@mui/material';
import Message from '../../components/Message'; // Keep or replace with MUI Alert
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price: Number(price), // Ensure price is a number
        image,
        brand,
        category,
        description,
        countInStock: Number(countInStock), // Ensure countInStock is a number
      }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    if (e.target.files && e.target.files[0]) {
      formData.append('image', e.target.files[0]);
      try {
        const res = await uploadProductImage(formData).unwrap();
        toast.success(res.message);
        setImage(res.image);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      {/* Replaced react-bootstrap Link with MUI Link + RouterLink */}
      <Button component={RouterLink} to='/admin/productlist' variant="outlined" sx={{ mb: 3 }}>
        Go Back
      </Button>
      <FormContainer>
        {/* Replaced h1 with Typography */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Edit Product
        </Typography>
        {loadingUpdate && <Loader />}
        {loadingUpload && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          // Consider using MUI Alert
          <Message variant='danger'>{error?.data?.message || error.error}</Message>
        ) : (
          /* Replaced Form with Box component="form" */
          <Box component="form" onSubmit={submitHandler} sx={{ mt: 1 }}>
            {/* Replaced Form.Group/Form.Control with TextField */}
            <TextField
              fullWidth
              margin="normal"
              id="name"
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="price"
              label="Price"
              type="number"
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              InputProps={{ inputProps: { min: 0, step: "0.01" } }} // Added input props for better number handling
            />

            {/* Image Input Field */}
            <TextField
              fullWidth
              margin="normal"
              id="image-url"
              label="Image URL"
              variant="outlined"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              sx={{ mb: 1 }} // Add margin bottom
            />
            {/* File Upload Input - styled to look like a button */}
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mb: 2 }} // Add margin bottom
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={uploadFileHandler}
              />
            </Button>

            <TextField
              fullWidth
              margin="normal"
              id="brand"
              label="Brand"
              variant="outlined"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="countInStock"
              label="Count In Stock"
              type="number"
              variant="outlined"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              required
              InputProps={{ inputProps: { min: 0 } }} // Added input props
            />

            <TextField
              fullWidth
              margin="normal"
              id="category"
              label="Category"
              variant="outlined"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              id="description"
              label="Description"
              variant="outlined"
              multiline // Allow multiple lines
              rows={4} // Set initial rows
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            {/* Replaced react-bootstrap Button with MUI Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
              disabled={loadingUpdate}
            >
              Update Product
              {loadingUpdate && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
            </Button>
          </Box>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
