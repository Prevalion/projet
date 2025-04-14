import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
      <Container>
        <Typography variant="body2" align="center">
          ProShop &copy; {currentYear}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
