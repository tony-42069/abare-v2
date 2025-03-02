import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Title, Text, Button, Group, Card, SimpleGrid } from '@mantine/core';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: NextPage = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Container>
        <Text>Loading...</Text>
      </Container>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <Container size="lg" py="xl">
      <Group position="apart" mb="xl">
        <div>
          <Title>Dashboard</Title>
          <Text color="dimmed">Welcome back, {user.full_name || user.email}</Text>
        </div>
        <Button onClick={logout} variant="light">
          Logout
        </Button>
      </Group>

      <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3}>Properties</Title>
          <Text mt="sm" mb="md" color="dimmed">
            Manage your real estate properties
          </Text>
          <Button variant="light" fullWidth onClick={() => router.push('/properties')}>
            View Properties
          </Button>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3}>Documents</Title>
          <Text mt="sm" mb="md" color="dimmed">
            Access and manage your documents
          </Text>
          <Button variant="light" fullWidth onClick={() => router.push('/documents')}>
            View Documents
          </Button>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Title order={3}>Analyses</Title>
          <Text mt="sm" mb="md" color="dimmed">
            Run and view property analyses
          </Text>
          <Button variant="light" fullWidth onClick={() => router.push('/analyses')}>
            View Analyses
          </Button>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default DashboardPage; 