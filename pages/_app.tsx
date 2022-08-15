import { Container, CssBaseline } from '@mui/material';

import { UserStore } from '../context/userContext';
import '../styles/globals.css'
import React from 'react';

import { Navigation } from '../components/Navigation';



function MyApp({ Component, pageProps }) {
  return (
    <UserStore>
      <CssBaseline />
      <Navigation />
      <Container maxWidth="md">
        <Component {...pageProps} />
      </Container>
    </UserStore>
  )
}

export default MyApp
