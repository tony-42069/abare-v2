import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Text } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

const HomePage: NextPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Container>
      <Text>Redirecting...</Text>
    </Container>
  );
};

export default HomePage; 