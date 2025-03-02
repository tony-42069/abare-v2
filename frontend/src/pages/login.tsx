import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, Paper, Text, Center } from '@mantine/core';

import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

const LoginPage: NextPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <Container size="xs" py="xl">
      <Center mb="lg">
        <Title order={1}>ABARE Platform</Title>
      </Center>
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={2} align="center" mb="md">
          Login
        </Title>
        <Text color="dimmed" size="sm" align="center" mb="lg">
          Sign in to your account to access the platform
        </Text>
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default LoginPage; 