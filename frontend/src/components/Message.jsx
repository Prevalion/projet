import { Alert } from '@mui/material';

const Message = ({ variant = 'info', children }) => {
  // Map Bootstrap variants to MUI severity
  const getSeverity = (variant) => {
    switch (variant) {
      case 'danger':
        return 'error';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Alert severity={getSeverity(variant)} sx={{ my: 2 }}>
      {children}
    </Alert>
  );
};

export default Message;
