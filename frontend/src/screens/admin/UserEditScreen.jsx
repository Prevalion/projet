import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'; // Renamed Link
// Removed react-bootstrap imports: Form, Button
// import { Form, Button } from 'react-bootstrap';
import {
  Box, // Used for layout
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  TextField, // Replaces Form.Control
  FormControlLabel, // Replaces Form.Check
  Checkbox, // Replaces Form.Check type='checkbox'
  CircularProgress, // Used for loading states
  Link, // MUI Link component
} from '@mui/material';
import Message from '../../components/Message'; // Keep or replace with MUI Alert
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
// Removed useParams import as it's already imported from react-router-dom
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  return (
    <>
      {/* Replaced react-bootstrap Link with MUI Button + RouterLink */}
      <Button component={RouterLink} to='/admin/userlist' variant="outlined" sx={{ mb: 3 }}>
        Go Back
      </Button>
      <FormContainer>
        {/* Replaced h1 with Typography */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Edit User
        </Typography>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          // Consider using MUI Alert
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
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
              id="email"
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Replaced Form.Group/Form.Check with FormControlLabel and Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  name="isAdmin"
                />
              }
              label="Is Admin"
              sx={{ mt: 1, display: 'block' }} // Ensure it takes full width if needed
            />

            {/* Replaced react-bootstrap Button with MUI Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 3, py: 1.5, fontWeight: 500 }}
              disabled={loadingUpdate}
            >
              Update User
              {loadingUpdate && <CircularProgress size={24} sx={{ ml: 1, color: 'white' }} />}
            </Button>
          </Box>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
