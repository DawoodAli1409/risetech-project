import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Register from './Pages/Register';
import VerifyEmail from './Pages/VerifyEmail';
import Login from './Pages/Login';
import Navbar from './components/Navbar';
import PasswordReset from './Pages/PasswordReset';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function ErrorPage() {
  return <h1>404 Not Found - The page you are looking for does not exist.</h1>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: (
      <>
        <Navbar />
        <Login />
      </>
    ),
  },
  {
    path: '/register',
    element: (
      <>
        <Navbar />
        <Register />
      </>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <>
        <Navbar />
        <VerifyEmail />
      </>
    ),
  },
  {
    path: '/password-reset',
    element: (
      <>
        <Navbar />
        <PasswordReset />
      </>
    ),
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
