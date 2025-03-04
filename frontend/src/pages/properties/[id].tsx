import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  Grid,
  Badge,
  Tabs,
  Paper,
  Loader,
  Box,
  Divider,
  ActionIcon,
  Menu,
} from '@mantine/core';
import { 
  IconArrowLeft, 
  IconEdit, 
  IconTrash, 
  IconDotsVertical, 
  IconBuilding, 
  IconMapPin, 
  IconChartBar, 
  IconUsers, 
  IconFiles 
} from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useProperties } from '../../hooks/useProperties';

const PropertyDetailsPage: NextPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    property, 
    loading: propertiesLoading, 
    error,
    fetchProperty,
    deleteProperty
  } = useProperties();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id && typeof id === 'string') {
      fetchProperty(id);
    }
  }, [isAuthenticated, id, fetchProperty]);

  const isLoading = authLoading || propertiesLoading;

  // Format currency
  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value?: number) => {
    if (value === undefined) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  // Handle property deletion
  const handleDelete = async () => {
    if (!property) return;
    
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(property.id);
        router.push('/properties');
      } catch (err) {
        console.error('Error deleting property:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Loader size="xl" />
      </Container>
    );
  }

  if (!property) {
    return (
      <Container>
        <Paper p="xl" withBorder>
          <Title order={3}>Property Not Found</Title>
          <Text mt="md">The property you are looking for does not exist or has been deleted.</Text>
          <Button 
            mt="lg" 
            leftIcon={<IconArrowLeft size={16} />}
            onClick={() => router.push('/properties')}
          >
            Back to Properties
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group position="apart" mb="xl">
        <Group>
          <Button 
            variant="subtle" 
            leftIcon={<IconArrowLeft size={16} />}
            onClick={() => router.push('/properties')}
          >
            Back
          </Button>
          <div>
            <Title>{property.name}</Title>
            <Text color="dimmed">
              {property.address.city}, {property.address.state}
            </Text>
          </div>
        </Group>
        <Group>
          <Button 
            variant="outline" 
            leftIcon={<IconEdit size={16} />}
            onClick={() => router.push(`/properties/${property.id}/edit`)}
          >
            Edit
          </Button>
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon size="lg" variant="light">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                icon={<IconEdit size={16} />}
                onClick={() => router.push(`/properties/${property.id}/edit`)}
              >
                Edit Property
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                color="red" 
                icon={<IconTrash size={16} />}
                onClick={handleDelete}
              >
                Delete Property
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {error && (
        <Paper p="md" mb="lg" withBorder sx={{ backgroundColor: '#FFF4F4' }}>
          <Text color="red">{error}</Text>
        </Paper>
      )}

      <Grid gutter="lg" mb="xl">
        <Grid.Col span={8}>
          <Card shadow="sm" p="lg" radius="md" withBorder mb="lg">
            <Group position="apart" mb="md">
              <Badge 
                size="lg"
                color={property.status === 'active' ? 'green' : 
                      property.status === 'pending' ? 'yellow' : 'gray'}
              >
                {property.status}
              </Badge>
              <Text weight={500} color="dimmed">
                {property.property_type.replace('_', ' ').toUpperCase()}
                {property.property_class && ` - Class ${property.property_class}`}
              </Text>
            </Group>

            <Tabs defaultValue="overview">
              <Tabs.List>
                <Tabs.Tab value="overview" icon={<IconBuilding size={14} />}>Overview</Tabs.Tab>
                <Tabs.Tab value="location" icon={<IconMapPin size={14} />}>Location</Tabs.Tab>
                <Tabs.Tab value="financials" icon={<IconChartBar size={14} />}>Financials</Tabs.Tab>
                <Tabs.Tab value="tenants" icon={<IconUsers size={14} />}>Tenants</Tabs.Tab>
                <Tabs.Tab value="documents" icon={<IconFiles size={14} />}>Documents</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="overview" pt="xs">
                <Box p="md">
                  {property.description && (
                    <>
                      <Text size="sm" weight={500} mb="xs">Description</Text>
                      <Text mb="lg">{property.description}</Text>
                      <Divider mb="lg" />
                    </>
                  )}

                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="sm" weight={500} mb="xs">Property Type</Text>
                      <Text mb="md" style={{ textTransform: 'capitalize' }}>
                        {property.property_type.replace('_', ' ')}
                      </Text>
                    </Grid.Col>
                    {property.property_class && (
                      <Grid.Col span={6}>
                        <Text size="sm" weight={500} mb="xs">Property Class</Text>
                        <Text mb="md">Class {property.property_class}</Text>
                      </Grid.Col>
                    )}
                    {property.year_built && (
                      <Grid.Col span={6}>
                        <Text size="sm" weight={500} mb="xs">Year Built</Text>
                        <Text mb="md">{property.year_built}</Text>
                      </Grid.Col>
                    )}
                    {property.total_sf && (
                      <Grid.Col span={6}>
                        <Text size="sm" weight={500} mb="xs">Total Square Footage</Text>
                        <Text mb="md">{property.total_sf.toLocaleString()} SF</Text>
                      </Grid.Col>
                    )}
                  </Grid>

                  {property.features && property.features.length > 0 && (
                    <>
                      <Divider my="lg" />
                      <Text size="sm" weight={500} mb="xs">Features</Text>
                      <Group spacing="xs">
                        {property.features.map((feature, index) => (
                          <Badge key={index} style={{ textTransform: 'capitalize' }}>
                            {feature.replace('_', ' ')}
                          </Badge>
                        ))}
                      </Group>
                    </>
                  )}
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="location" pt="xs">
                <Box p="md">
                  <Text size="sm" weight={500} mb="xs">Address</Text>
                  <Text>{property.address.street}</Text>
                  <Text>{property.address.city}, {property.address.state} {property.address.zip_code}</Text>
                  <Text mb="lg">{property.address.country}</Text>

                  <Divider my="lg" />
                  <Text size="sm" color="dimmed">
                    Map view will be implemented in a future update.
                  </Text>
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="financials" pt="xs">
                <Box p="md">
                  <Grid>
                    {property.financial_metrics.noi !== undefined && (
                      <Grid.Col span={6}>
                        <Paper p="md" withBorder>
                          <Text size="sm" weight={500} mb="xs">Net Operating Income (NOI)</Text>
                          <Title order={3}>{formatCurrency(property.financial_metrics.noi)}</Title>
                        </Paper>
                      </Grid.Col>
                    )}
                    {property.financial_metrics.cap_rate !== undefined && (
                      <Grid.Col span={6}>
                        <Paper p="md" withBorder>
                          <Text size="sm" weight={500} mb="xs">Cap Rate</Text>
                          <Title order={3}>{formatPercentage(property.financial_metrics.cap_rate)}</Title>
                        </Paper>
                      </Grid.Col>
                    )}
                    {property.financial_metrics.occupancy_rate !== undefined && (
                      <Grid.Col span={6}>
                        <Paper p="md" withBorder>
                          <Text size="sm" weight={500} mb="xs">Occupancy Rate</Text>
                          <Title order={3}>{formatPercentage(property.financial_metrics.occupancy_rate)}</Title>
                        </Paper>
                      </Grid.Col>
                    )}
                    {property.financial_metrics.property_value !== undefined && (
                      <Grid.Col span={6}>
                        <Paper p="md" withBorder>
                          <Text size="sm" weight={500} mb="xs">Property Value</Text>
                          <Title order={3}>{formatCurrency(property.financial_metrics.property_value)}</Title>
                        </Paper>
                      </Grid.Col>
                    )}
                    {property.financial_metrics.price_per_sf !== undefined && (
                      <Grid.Col span={6}>
                        <Paper p="md" withBorder>
                          <Text size="sm" weight={500} mb="xs">Price per Square Foot</Text>
                          <Title order={3}>{formatCurrency(property.financial_metrics.price_per_sf)}/SF</Title>
                        </Paper>
                      </Grid.Col>
                    )}
                  </Grid>

                  {Object.values(property.financial_metrics).every(v => v === undefined) && (
                    <Text color="dimmed" align="center" py="xl">
                      No financial metrics available for this property.
                    </Text>
                  )}
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="tenants" pt="xs">
                <Box p="md">
                  {property.tenants && property.tenants.length > 0 ? (
                    property.tenants.map((tenant, index) => (
                      <Paper key={index} p="md" withBorder mb="md">
                        <Text weight={500}>{tenant.name}</Text>
                        <Grid>
                          {tenant.lease_start && tenant.lease_end && (
                            <Grid.Col span={6}>
                              <Text size="sm" weight={500} mb="xs">Lease Period</Text>
                              <Text size="sm">
                                {new Date(tenant.lease_start).toLocaleDateString()} - 
                                {new Date(tenant.lease_end).toLocaleDateString()}
                              </Text>
                            </Grid.Col>
                          )}
                          {tenant.sf_leased && (
                            <Grid.Col span={6}>
                              <Text size="sm" weight={500} mb="xs">Space Leased</Text>
                              <Text size="sm">{tenant.sf_leased.toLocaleString()} SF</Text>
                            </Grid.Col>
                          )}
                          {tenant.monthly_rent && (
                            <Grid.Col span={6}>
                              <Text size="sm" weight={500} mb="xs">Monthly Rent</Text>
                              <Text size="sm">{formatCurrency(tenant.monthly_rent)}</Text>
                            </Grid.Col>
                          )}
                        </Grid>
                        {tenant.notes && (
                          <>
                            <Text size="sm" weight={500} mt="md" mb="xs">Notes</Text>
                            <Text size="sm">{tenant.notes}</Text>
                          </>
                        )}
                      </Paper>
                    ))
                  ) : (
                    <Text color="dimmed" align="center" py="xl">
                      No tenants available for this property.
                    </Text>
                  )}
                  <Button 
                    mt="md" 
                    variant="outline" 
                    fullWidth
                    onClick={() => router.push(`/properties/${property.id}/tenants/add`)}
                  >
                    Add Tenant
                  </Button>
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="documents" pt="xs">
                <Box p="md">
                  {property.document_ids && property.document_ids.length > 0 ? (
                    <Text>Documents will be displayed here.</Text>
                  ) : (
                    <Text color="dimmed" align="center" py="xl">
                      No documents available for this property.
                    </Text>
                  )}
                  <Button 
                    mt="md" 
                    variant="outline" 
                    fullWidth
                    onClick={() => router.push(`/documents/upload?propertyId=${property.id}`)}
                  >
                    Upload Document
                  </Button>
                </Box>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Grid.Col>

        <Grid.Col span={4}>
          <Card shadow="sm" p="lg" radius="md" withBorder mb="lg">
            <Title order={4} mb="md">Quick Actions</Title>
            <Divider mb="md" />
            <Button 
              fullWidth 
              mb="md" 
              leftIcon={<IconEdit size={16} />}
              onClick={() => router.push(`/properties/${property.id}/edit`)}
            >
              Edit Property
            </Button>
            <Button 
              fullWidth 
              mb="md" 
              leftIcon={<IconFiles size={16} />}
              variant="outline"
              onClick={() => router.push(`/documents/upload?propertyId=${property.id}`)}
            >
              Upload Document
            </Button>
            <Button 
              fullWidth 
              mb="md" 
              leftIcon={<IconChartBar size={16} />}
              variant="outline"
              onClick={() => router.push(`/analyses/new?propertyId=${property.id}`)}
            >
              Create Analysis
            </Button>
            <Button 
              fullWidth 
              color="red" 
              leftIcon={<IconTrash size={16} />}
              variant="outline"
              onClick={handleDelete}
            >
              Delete Property
            </Button>
          </Card>

          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Title order={4} mb="md">Property Summary</Title>
            <Divider mb="md" />
            
            <Text size="sm" weight={500} mb="xs">Status</Text>
            <Badge 
              mb="md" 
              color={property.status === 'active' ? 'green' : 
                    property.status === 'pending' ? 'yellow' : 'gray'}
            >
              {property.status}
            </Badge>
            
            <Text size="sm" weight={500} mb="xs">Type</Text>
            <Text mb="md" style={{ textTransform: 'capitalize' }}>
              {property.property_type.replace('_', ' ')}
              {property.property_class && ` (Class ${property.property_class})`}
            </Text>
            
            <Text size="sm" weight={500} mb="xs">Location</Text>
            <Text mb="md">
              {property.address.city}, {property.address.state}
            </Text>
            
            {property.total_sf && (
              <>
                <Text size="sm" weight={500} mb="xs">Size</Text>
                <Text mb="md">{property.total_sf.toLocaleString()} SF</Text>
              </>
            )}
            
            {property.financial_metrics.property_value && (
              <>
                <Text size="sm" weight={500} mb="xs">Value</Text>
                <Text mb="md">{formatCurrency(property.financial_metrics.property_value)}</Text>
              </>
            )}
            
            <Divider my="md" />
            
            <Text size="xs" color="dimmed">
              Created: {new Date(property.created_at).toLocaleDateString()}
            </Text>
            <Text size="xs" color="dimmed">
              Last Updated: {new Date(property.updated_at).toLocaleDateString()}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default PropertyDetailsPage;
