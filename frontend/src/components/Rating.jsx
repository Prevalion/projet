import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Box, Typography } from '@mui/material';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', color: '#f8e825' }}>
        <Box component="span" sx={{ mx: 0.1 }}>
          {value >= 1 ? (
            <FaStar />
          ) : value >= 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </Box>
        <Box component="span" sx={{ mx: 0.1 }}>
          {value >= 2 ? (
            <FaStar />
          ) : value >= 1.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </Box>
        <Box component="span" sx={{ mx: 0.1 }}>
          {value >= 3 ? (
            <FaStar />
          ) : value >= 2.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </Box>
        <Box component="span" sx={{ mx: 0.1 }}>
          {value >= 4 ? (
            <FaStar />
          ) : value >= 3.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </Box>
        <Box component="span" sx={{ mx: 0.1 }}>
          {value >= 5 ? (
            <FaStar />
          ) : value >= 4.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </Box>
      </Box>
      {text && (
        <Typography variant="body2" sx={{ ml: 1, fontWeight: 600, fontSize: '0.8rem' }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default Rating;
