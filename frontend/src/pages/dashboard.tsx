import { NextPage } from 'next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Group, 
  Card, 
  SimpleGrid, 
  Grid, 
  Divider, 
  Badge, 
  Loader, 
  Paper,
  ThemeIcon,
  RingProgress,
  Center,
  Stack
} from '@mantine/core';
import { IconBuilding, IconFileAnalytics, IconFiles, IconChartBar, IconCurrencyDollar, IconPercentage } from '@tabler/icons-react';
import { useAuth } from '../hooks/useAuth';
import { useProperties } from '../hooks/useProperties';

const DashboardPage: NextPage = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { 
    properties, 
    stats, 
    loading: propertiesLoading, 
    error,
    fetchProperties,
    fetchPropertyStats
  } = useProperties();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties(0, 5); // Get first 5 properties
      fetchPropertyStats();
    }
  }, [isAuthenticated, fetchProperties, fetchPropertyStats]);

  const isLoading = authLoading || propertiesLoading;

  if (isLoading) {
    return (
      <Container>
        <Center style={{ height: '100vh' }}>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

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

      {error && (
        <Paper p="md" mb="lg" withBorder sx={{ backgroundColor: '#FFF4F4' }}>
          <Text color="red">{error}</Text>
        </Paper>
      )}

      {/* Stats Cards */}
      <SimpleGrid cols={3} spacing="lg" mb="xl" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700} transform="uppercase">
                Total Properties
              </Text>
              <Title order={3}>{stats?.totalProperties || 0}</Title>
            </div>
            <ThemeIcon size={56} radius="md" color="blue">
              <IconBuilding size={28} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700} transform="uppercase">
                Portfolio Value
              </Text>
              <Title order={3}>{stats ? formatCurrency(stats.totalValue) : '$0'}</Title>
            </div>
            <ThemeIcon size={56} radius="md" color="green">
              <IconCurrencyDollar size={28} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Group position="apart">
            <div>
              <Text size="xs" color="dimmed" weight={700} transform="uppercase">
                Average Cap Rate
              </Text>
              <Title order={3}>{stats ? formatPercentage(stats.averageCapRate) : '0%'}</Title>
            </div>
            <ThemeIcon size={56} radius="md" color="orange">
              <IconPercentage size={28} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      <Grid gutter="lg" mb="xl">
        {/* Recent Properties */}
        <Grid.Col span={8}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Group position="apart" mb="md">
              <Title order={4}>Recent Properties</Title>
              <Button 
                variant="subtle" 
                compact 
                onClick={() => router.push('/properties')}
              >
                View All
              </Button>
            </Group>
            <Divider mb="md" />
            
            {properties.length === 0 ? (
              <Text color="dimmed" align="center" py="lg">
                No properties found. Add your first property to get started.
              </Text>
            ) : (
              <Stack spacing="xs">
                {properties.map((property) => (
                  <Paper key={property.id} p="md" withBorder>
                    <Group position="apart">
                      <div>
                        <Text weight={500}>{property.name}</Text>
                        <Text size="xs" color="dimmed">
                          {property.address.city}, {property.address.state}
                        </Text>
                      </div>
                      <div>
                        <Badge color={property.status === 'active' ? 'green' : 'gray'}>
                          {property.status}
                        </Badge>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
            
            <Button 
              fullWidth 
              mt="md" 
              onClick={() => router.push('/properties/new')}
            >
              Add New Property
            </Button>
          </Card>
        </Grid.Col>

        {/* Quick Actions */}
        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={4} mb="md">Quick Actions</Title>
            <Divider mb="md" />
            
            <Stack spacing="md">
              <Button 
                leftIcon={<IconBuilding size={20} />} 
                fullWidth 
                variant="outline"
                onClick={() => router.push('/properties/new')}
              >
                Add Property
              </Button>
              
              <Button 
                leftIcon={<IconFiles size={20} />} 
                fullWidth 
                variant="outline"
                onClick={() => router.push('/documents/upload')}
              >
                Upload Document
              </Button>
              
              <Button 
                leftIcon={<IconFileAnalytics size={20} />} 
                fullWidth 
                variant="outline"
                onClick={() => router.push('/analyses/new')}
              >
                Create Analysis
              </Button>
              
              <Button 
                leftIcon={<IconChartBar size={20} />} 
                fullWidth 
                variant="outline"
                onClick={() => router.push('/dashboard/reports')}
              >
                Generate Report
              </Button>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Feature Cards */}
      <SimpleGrid cols={3} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <ThemeIcon size={40} radius="md" color="blue" mb="md">
            <IconBuilding size={24} />
          </ThemeIcon>
          <Title order={3}>Properties</Title>
          <Text mt="sm" mb="md" color="dimmed">
            Manage your real estate properties, track performance metrics, and view property details.
          </Text>
          <Button variant="light" fullWidth onClick={() => router.push('/properties')}>
            View Properties
          </Button>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <ThemeIcon size={40} radius="md" color="green" mb="md">
            <IconFiles size={24} />
          </ThemeIcon>
          <Title order={3}>Documents</Title>
          <Text mt="sm" mb="md" color="dimmed">
            Upload, organize, and access property-related documents including leases, financials, and more.
          </Text>
          <Button variant="light" fullWidth onClick={() => router.push('/documents')}>
            View Documents
          </Button>
        </Card>

        <Card shadow="sm" p="lg" radius="md" withBorder>
          <ThemeIcon size={40} radius="md" color="orange" mb="md">
            <IconFileAnalytics size={24} />
          </ThemeIcon>
          <Title order={3}>Analyses</Title>
          <Text mt="sm" mb="md" color="dimmed">
            Run financial analyses on your properties, generate reports, and gain valuable insights.
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
