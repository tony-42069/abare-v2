import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';
import '../styles/globals.css';

// Create a client
const queryClient = new QueryClient();

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  // List of paths that don't use MainLayout (like auth pages)
  const noLayoutPaths = ['/login', '/register', '/'];

  // Check if the current path should use the layout
  const useLayout = !noLayoutPaths.includes(props.router.pathname);

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
            colorScheme: 'dark',
            primaryColor: 'blue',
            colors: {
              // Adding custom colors to match our CSS variables
              blue: ['#E7F5FF', '#D0EBFF', '#A5D8FF', '#74C0FC', '#4DABF7', '#339AF0', '#228BE6', '#1C7ED6', '#0EA5E9', '#0C8DCF'],
              purple: ['#F3F0FF', '#E5DBFF', '#D0BFFF', '#B197FC', '#9775FA', '#845EF7', '#7950F2', '#6741D9', '#A855F7', '#9333EA'],
              pink: ['#FFF0F6', '#FFDEEB', '#FCC2D7', '#FAA2C1', '#F783AC', '#F06595', '#E64980', '#D6336C', '#EC4899', '#DB2777'],
            },
            components: {
              Button: {
                defaultProps: {
                  color: 'blue',
                },
              },
              Card: {
                defaultProps: {
                  p: 'lg',
                  radius: 'md',
                },
                styles: {
                  root: {
                    backgroundColor: 'rgba(15, 23, 42, 0.7)',
                  },
                },
              },
            },
          }}
        >
          <AuthProvider>
            <Notifications />
            {useLayout ? (
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            ) : (
              <Component {...pageProps} />
            )}
          </AuthProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}
