import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { 
  useGetUsersQuery, 
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkUpdateUsersMutation
} from '../../slices/usersApiSlice';

const UserManagementScreen = () => {
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const [updateUser] = useUpdateUserMutation();
  const [bulkUpdate] = useBulkUpdateUsersMutation();
  const [selectedIds, setSelectedIds] = useState([]);

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1, editable: true },
    { field: 'email', headerName: 'Email', flex: 1, editable: true },
    { 
      field: 'role', 
      headerName: 'Role', 
      flex: 1,
      type: 'singleSelect',
      valueOptions: ['user', 'admin'],
      editable: true
    },
    { 
      field: 'lastLogin', 
      headerName: 'Last Active', 
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { 
      field: 'actions', 
      headerName: 'Actions',
      renderCell: (params) => (
        <Button 
          color="error"
          onClick={() => handleDelete(params.row._id)}
        >
          Delete
        </Button>
      )
    }
  ];

  const processRowUpdate = async (newRow) => {
    await updateUser(newRow);
    return newRow;
  };

  const handleBulkRoleChange = async (newRole) => {
    await bulkUpdate({ ids: selectedIds, role: newRole });
    refetch();
  };

  return (
    <Box sx={{ height: 800, width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained"
          onClick={() => handleBulkRoleChange('admin')}
          disabled={!selectedIds.length}
        >
          Make Admin
        </Button>
        <Button 
          variant="outlined"
          onClick={() => handleBulkRoleChange('user')}
          disabled={!selectedIds.length}
        >
          Make User
        </Button>
      </Box>
      
      <DataGrid
        rows={users || []}
        columns={columns}
        getRowId={(row) => row._id}
        loading={isLoading}
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedIds(ids)}
        processRowUpdate={processRowUpdate}
        components={{ Toolbar: GridToolbar }}
        disableRowSelectionOnClick
      />
    </Box>
  );
};