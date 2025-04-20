import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';

const ResponsiveContainer = ({ children, maxWidth = 'lg', ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
  const getMaxWidth = () => {
    switch (maxWidth) {
      case 'xs':
        return '444px';
      case 'sm':
        return '600px';
      case 'md':
        return '900px';
      case 'lg':
        return '1200px';
      case 'xl':
        return '1536px';
      default:
        return '1200px';
    }
  };
  
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: getMaxWidth(),
        mx: 'auto',
        px: isMobile ? 2 : isTablet ? 3 : 4,
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ResponsiveContainer;