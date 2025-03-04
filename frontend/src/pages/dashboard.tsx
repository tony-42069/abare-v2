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
          <Loader size="xl" color="var(--abare-blue)" />
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
        <Card className="glass-card stats-card">
          <Group position="apart">
            <div>
              <Text size="xs" color="var(--abare-text-secondary)" weight={700} transform="uppercase">
                Total Properties
              </Text>
              <Title order={3}>{stats?.totalProperties || 0}</Title>
            </div>
            <div className="stats-icon">
              <IconBuilding size={28} />
            </div>
          </Group>
        </Card>

        <Card className="glass-card stats-card">
          <Group position="apart">
            <div>
              <Text size="xs" color="var(--abare-text-secondary)" weight={700} transform="uppercase">
                Portfolio Value
              </Text>
              <Title order={3}>{stats ? formatCurrency(stats.totalValue) : '$0'}</Title>
            </div>
            <div className="stats-icon">
              <IconCurrencyDollar size={28} />
            </div>
          </Group>
        </Card>

        <Card className="glass-card stats-card">
          <Group position="apart">
            <div>
              <Text size="xs" color="var(--abare-text-secondary)" weight={700} transform="uppercase">
                Average Cap Rate
              </Text>
              <Title order={3}>{stats ? formatPercentage(stats.averageCapRate) : '0%'}</Title>
            </div>
            <div className="stats-icon">
              <IconPercentage size={28} />
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      <Grid gutter="lg" mb="xl">
        {/* Recent Properties */}
        <Grid.Col span={8}>
          <Card className="glass-card" p="lg">
            <Group position="apart" mb="md">
              <Title order={4}>Recent Properties</Title>
              <Button 
                variant="subtle" 
                compact 
                className="gradient-text"
                onClick={() => router.push('/properties')}
              >
                View All
              </Button>
            </Group>
            <Divider 
              mb="md" 
              sx={{ borderColor: 'var(--abare-card-border)' }}
            />
            
            {properties.length === 0 ? (
              <Text color="var(--abare-text-secondary)" align="center" py="lg">
                No properties found. Add your first property to get started.
              </Text>
            ) : (
              <Stack spacing="xs">
                {properties.map((property) => (
                  <Paper 
                    key={property.id} 
                    p="md" 
                    className="glass-card"
                    sx={{ 
                      background: 'rgba(15, 23, 42, 0.3)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    <Group position="apart">
                      <div>
                        <Text weight={500}>{property.name}</Text>
                        <Text size="xs" color="var(--abare-text-secondary)">
                          {property.address.city}, {property.address.state}
                        </Text>
                      </div>
                      <div>
                        <Badge 
                          sx={{
                            background: property.status === 'active' 
                              ? 'linear-gradient(45deg, var(--abare-blue), var(--abare-purple))' 
                              : 'rgba(148, 163, 184, 0.2)',
                            color: property.status === 'active' ? 'white' : 'var(--abare-text-secondary)'
                          }}
                        >
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
              className="gradient-button"
              onClick={() => router.push('/properties/new')}
              sx={{ marginTop: '20px' }}
            >
              Add New Property
            </Button>
          </Card>
        </Grid.Col>

        {/* Quick Actions */}
        <Grid.Col span={4}>
          <Card className="glass-card" p="lg">
            <Title order={4} mb="md">Quick Actions</Title>
            <Divider 
              mb="md" 
              sx={{ borderColor: 'var(--abare-card-border)' }}
            />
            
            <Stack spacing="md">
              <Button 
                leftIcon={<IconBuilding size={20} />} 
                fullWidth 
                className="gradient-button"
                onClick={() => router.push('/properties/new')}
              >
                Add Property
              </Button>
              
              <Button 
                leftIcon={<IconFiles size={20} />} 
                fullWidth 
                className="gradient-button"
                onClick={() => router.push('/documents/upload')}
              >
                Upload Document
              </Button>
              
              <Button 
                leftIcon={<IconFileAnalytics size={20} />} 
                fullWidth 
                className="gradient-button"
                onClick={() => router.push('/analyses/new')}
              >
                Create Analysis
              </Button>
              
              <Button 
                leftIcon={<IconChartBar size={20} />} 
                fullWidth 
                className="gradient-button"
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
        <Card className="glass-card" p="lg">
          <div className="stats-icon" style={{ marginBottom: '1rem' }}>
            <IconBuilding size={24} />
          </div>
          <Title order={3} className="gradient-text">Properties</Title>
          <Text mt="sm" mb="md" color="var(--abare-text-secondary)">
            Manage your real estate properties, track performance metrics, and view property details.
          </Text>
          <Button 
            className="gradient-button"
            fullWidth 
            onClick={() => router.push('/properties')}
          >
            View Properties
          </Button>
        </Card>

        <Card className="glass-card" p="lg">
          <div className="stats-icon" style={{ marginBottom: '1rem' }}>
            <IconFiles size={24} />
          </div>
          <Title order={3} className="gradient-text">Documents</Title>
          <Text mt="sm" mb="md" color="var(--abare-text-secondary)">
            Upload, organize, and access property-related documents including leases, financials, and more.
          </Text>
          <Button 
            className="gradient-button"
            fullWidth 
            onClick={() => router.push('/documents')}
          >
            View Documents
          </Button>
        </Card>

        <Card className="glass-card" p="lg">
          <div className="stats-icon" style={{ marginBottom: '1rem' }}>
            <IconFileAnalytics size={24} />
          </div>
          <Title order={3} className="gradient-text">Analyses</Title>
          <Text mt="sm" mb="md" color="var(--abare-text-secondary)">
            Run financial analyses on your properties, generate reports, and gain valuable insights.
          </Text>
          <Button 
            className="gradient-button"
            fullWidth 
            onClick={() => router.push('/analyses')}
          >
            View Analyses
          </Button>
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default DashboardPage;
