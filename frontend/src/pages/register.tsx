import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, Paper, Text, Center } from '@mantine/core';

import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: NextPage = () => {
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
          Create an Account
        </Title>
        <Text color="dimmed" size="sm" align="center" mb="lg">
          Register to access the ABARE Platform
        </Text>
        <RegisterForm />
      </Paper>
    </Container>
  );
};

export default RegisterPage; 