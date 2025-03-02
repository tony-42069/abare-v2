import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

// Create a client
const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>ABARE Platform v2</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            colorScheme: 'light',
            primaryColor: 'blue',
          }}
        >
          <AuthProvider>
            <Notifications />
            <Component {...pageProps} />
          </AuthProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
} 