import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useGetUsersQuery, useUpdateUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  const handleRoleUpdate = async (id, newRole) => {
    try {
      await updateUser({ userId: id, role: newRole });
      toast.success('User role updated');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 1,
      renderCell: (params) => (
        <select 
          value={params.value}
          onChange={(e) => handleRoleUpdate(params.row._id, e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      )
    },
    { field: 'lastLogin', headerName: 'Last Login', flex: 1 }
  ];

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={users || []}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row._id}
        loading={isLoading}
      />
    </div>
  );
};

export default UserListScreen;
