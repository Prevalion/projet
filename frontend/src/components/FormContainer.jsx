import { Container, Grid, Box } from '@mui/material';

const FormContainer = ({ children }) => {
  return (
    <Container>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={6}>
          <Box sx={{ mt: 2, mb: 4 }}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FormContainer;
