 import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Stack,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#1565c0',
          },
          background: {
            default: darkMode ? '#121212' : '#f0f4f8',
            paper: darkMode ? '#1d1d1d' : '#ffffff',
          },
        },
        typography: {
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
      }),
    [darkMode]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const [authError, setAuthError] = useState(null);

  const onSubmit = async (data) => {
    setAuthError(null);
    try {
      const email = data.email.trim();
      const password = data.password.trim();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setAuthError('Please verify your email first.');
        // Redirect to verify email page (to be designed later)
        setTimeout(() => {
          navigate('/verify-email');
        }, 3000);
        return;
      }

      // Successful login
      setAuthError(null);
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/wrong-password') {
        setAuthError('Incorrect password.');
      } else if (error.code === 'auth/user-not-found') {
        setAuthError('No user found with this email.');
      } else if (error.code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials. Please check your email and password.');
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account',
    });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        setAuthError('Please verify your email first.');
        setTimeout(() => {
          navigate('/verify-email');
        }, 3000);
        return;
      }

      setAuthError(null);
      alert('Google sign-in successful!');
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setAuthError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 2,
            boxShadow: 6,
            borderRadius: 6,
            backgroundColor: 'background.paper',
            width: '100%',
            maxWidth: 420,
            mx: 'auto',
            mt: 5,
            mb: 3,
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': {
              boxShadow: 12,
            },
          }}
        >
          <Box sx={{ alignSelf: 'flex-end' }}>
            <IconButton
              sx={{ mb: 1 }}
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
              aria-label="toggle dark mode"
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: '700', color: 'primary.main' }}
          >
            Sign In
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <Stack spacing={1}>
              <TextField
                label="Email Address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                variant="filled"
                size="small"
                sx={{
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  '& .MuiInputBase-root': {
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  },
                  '& .MuiInputBase-input': {
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                variant="filled"
                size="small"
                sx={{
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  '& .MuiInputBase-root': {
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  },
                  '& .MuiInputBase-input': {
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  },
                }}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              disabled={isSubmitting}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontWeight: 'bold',
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              size="medium"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              sx={{
                mb: 2,
                py: 1.5,
                fontWeight: 'bold',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.light',
                },
              }}
            >
              Sign in with Google
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/password-reset');
                  }}
                  underline="hover"
                  sx={{ cursor: 'pointer' }}
                >
                  Forgot Password?
                </Link>
              </Typography>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register');
                  }}
                  underline="hover"
                  sx={{ cursor: 'pointer' }}
                >
                  Create one
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
