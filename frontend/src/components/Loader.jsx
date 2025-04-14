import { CircularProgress, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
