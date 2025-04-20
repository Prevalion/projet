import React from 'react';
// Removed react-bootstrap imports: Table, Button
// import { Table, Button } from 'react-bootstrap';
import {
  Typography, // Used for text elements
  Button, // Replaces react-bootstrap Button
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, // Used for container styling
  IconButton, // Replaces Button for icons
  Link as MuiLink, // MUI Link component
} from '@mui/material';
// import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; // Replace with MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Message from '../../components/Message'; // Keep or replace with MUI Alert
import Loader from '../../components/Loader';
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { Link as RouterLink } from 'react-router-dom'; // Renamed Link
import Meta from '../../components/Meta'; // Import Meta component

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation(); // Added loading state for delete

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) { // Improved confirmation message
      try {
        await deleteUser(id);
        toast.success('User deleted'); // Added success toast
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title="Admin: User List" /> {/* Added Meta component */}
      {/* Replaced h1 with Typography */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Users
      </Typography>
      {isLoading ? (
        <Loader />
      ) : error ? (
        // Consider using MUI Alert
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        // Replaced react-bootstrap Table with MUI Table components
        <TableContainer component={Paper} elevation={1}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead sx={{ bgcolor: 'grey.100' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>NAME</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>ADMIN</TableCell>
                <TableCell></TableCell> {/* Empty cell for action buttons */}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user._id}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    {/* Use MUI Link for mailto */}
                    <MuiLink href={`mailto:${user.email}`} sx={{ textDecoration: 'none', color: 'primary.main' }}>
                      {user.email}
                    </MuiLink>
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <CheckIcon sx={{ color: 'green' }} />
                    ) : (
                      <CloseIcon sx={{ color: 'red' }} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {!user.isAdmin && (
                      <>
                        {/* Replaced react-bootstrap Buttons with MUI IconButtons */}
                        <IconButton
                          component={RouterLink}
                          to={`/admin/user/${user._id}/edit`}
                          size="small"
                          sx={{ mr: 1 }} // Add margin right
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteHandler(user._id)}
                          disabled={loadingDelete} // Disable button while deleting
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default UserListScreen;