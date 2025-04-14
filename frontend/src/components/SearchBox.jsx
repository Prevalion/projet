import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
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
    <Box component="form" onSubmit={submitHandler} sx={{ display: 'flex' }}>
      <TextField
        size="small"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        variant="outlined"
        sx={{ mr: 1, bgcolor: 'background.paper' }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        color="secondary" 
        size="small"
        startIcon={<Search />}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBox;
