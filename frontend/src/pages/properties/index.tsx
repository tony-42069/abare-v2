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
  Table,
  Badge,
  ActionIcon,
  Menu,
  Loader,
  TextInput,
  Select,
  Box,
  Paper,
  Pagination,
} from '@mantine/core';
import { IconSearch, IconFilter, IconDotsVertical, IconEdit, IconTrash, IconEye, IconPlus } from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useProperties } from '../../hooks/useProperties';
import { Property } from '../../types';

const PropertiesPage: NextPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    properties, 
    loading: propertiesLoading, 
    error,
    fetchProperties,
    deleteProperty
  } = useProperties();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties((page - 1) * limit, limit);
    }
  }, [isAuthenticated, fetchProperties, page, limit]);

  const isLoading = authLoading || propertiesLoading;

  // Filter properties based on search term and property type
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchTerm === '' || 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = propertyType === null || property.property_type === propertyType;
    
    return matchesSearch && matchesType;
  });

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

  // Handle property deletion
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await deleteProperty(id);
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

  return (
    <Container size="xl" py="xl">
      <Group position="apart" mb="xl">
        <div>
          <Title>Properties</Title>
          <Text color="dimmed">Manage your real estate portfolio</Text>
        </div>
        <Button 
          leftIcon={<IconPlus size={16} />} 
          onClick={() => router.push('/properties/new')}
        >
          Add Property
        </Button>
      </Group>

      {error && (
        <Paper p="md" mb="lg" withBorder sx={{ backgroundColor: '#FFF4F4' }}>
          <Text color="red">{error}</Text>
        </Paper>
      )}

      <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Group position="apart" mb="md">
          <TextInput
            placeholder="Search properties..."
            icon={<IconSearch size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by type"
            icon={<IconFilter size={16} />}
            value={propertyType}
            onChange={setPropertyType}
            clearable
            data={[
              { value: 'office', label: 'Office' },
              { value: 'retail', label: 'Retail' },
              { value: 'industrial', label: 'Industrial' },
              { value: 'multifamily', label: 'Multifamily' },
              { value: 'mixed_use', label: 'Mixed Use' },
            ]}
            style={{ width: 200 }}
          />
        </Group>

        {filteredProperties.length === 0 ? (
          <Text color="dimmed" align="center" py="xl">
            No properties found. Add your first property to get started.
          </Text>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Size (SF)</th>
                  <th>Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <Text weight={500}>{property.name}</Text>
                    </td>
                    <td>
                      {property.address.city}, {property.address.state}
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>
                      {property.property_type.replace('_', ' ')}
                    </td>
                    <td>{property.total_sf?.toLocaleString() || 'N/A'}</td>
                    <td>
                      {formatCurrency(property.financial_metrics.property_value)}
                    </td>
                    <td>
                      <Badge 
                        color={property.status === 'active' ? 'green' : 
                              property.status === 'pending' ? 'yellow' : 'gray'}
                      >
                        {property.status}
                      </Badge>
                    </td>
                    <td>
                      <Group spacing={0} position="right">
                        <ActionIcon onClick={() => router.push(`/properties/${property.id}`)}>
                          <IconEye size={16} />
                        </ActionIcon>
                        <ActionIcon onClick={() => router.push(`/properties/${property.id}/edit`)}>
                          <IconEdit size={16} />
                        </ActionIcon>
                        <Menu position="bottom-end">
                          <Menu.Target>
                            <ActionIcon>
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item 
                              icon={<IconEye size={16} />}
                              onClick={() => router.push(`/properties/${property.id}`)}
                            >
                              View Details
                            </Menu.Item>
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
                              onClick={() => handleDelete(property.id)}
                            >
                              Delete Property
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        )}

        <Group position="center" mt="md">
          <Pagination
            total={Math.ceil(properties.length / limit)}
            value={page}
            onChange={setPage}
          />
        </Group>
      </Card>
    </Container>
  );
};

export default PropertiesPage;
