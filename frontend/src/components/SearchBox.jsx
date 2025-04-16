import React, { useState } from 'react';
import { Button, Box, InputBase } from '@mui/material';
import { Search } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/search/${keyword.trim()}`);
      setKeyword('');
    } else {
      navigate('/');
    }
  };

  return (
    <Box component="form" onSubmit={submitHandler} sx={{ 
      display: 'flex',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: '4px',
      padding: '0 10px',
      width: '300px'
    }}>
      <InputBase
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
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
        Search
      </Button>
    </Box>
  );
};

export default SearchBox;
