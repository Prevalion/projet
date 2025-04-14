import { Stepper, Step, StepLabel, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { label: 'Sign In', link: '/login', active: step1 },
    { label: 'Shipping', link: '/shipping', active: step2 },
    { label: 'Payment', link: '/payment', active: step3 },
    { label: 'Place Order', link: '/placeorder', active: step4 }
  ];

  const activeStep = steps.filter(step => step.active).length - 1;

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                {step.active ? (
                  <Link 
                    to={step.link} 
                    style={{ 
                      color: index <= activeStep ? 'inherit' : '#bdbdbd',
                      textDecoration: 'none' 
                    }}
                  >
                    {step.label}
                  </Link>
                ) : (
                  <span style={{ color: '#bdbdbd' }}>{step.label}</span>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
    </Box>
  );
};

export default CheckoutSteps;
