import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, InputBase, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const SearchBox = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/search');
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={submitHandler}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        borderRadius: '4px',
        padding: '0 10px',
        width: '300px'
      }}
    >
      <InputBase
        placeholder="Search Products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        sx={{ ml: 1, flex: 1, color: 'black' }}
        inputProps={{ 'aria-label': 'search products' }}
      />
      <Button 
        type="submit"
        variant="contained" 
        color="secondary" 
        size="small"
        sx={{ height: '32px', minWidth: '60px' }}
      >
        <SearchIcon fontSize="small" />
      </Button>
    </Box>
  );
};

export default SearchBox;
