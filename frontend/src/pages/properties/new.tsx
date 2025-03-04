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
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Divider,
  Grid,
  Paper,
  Loader,
  Box,
  Stepper,
  MultiSelect,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconBuilding, IconMapPin, IconChartBar } from '@tabler/icons-react';
import { useAuth } from '../../hooks/useAuth';
import { useProperties } from '../../hooks/useProperties';
import { Property } from '../../types';

const NewPropertyPage: NextPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { createProperty, loading: propertiesLoading, error } = useProperties();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const form = useForm({
    initialValues: {
      // Basic Info
      name: '',
      property_type: '',
      property_class: '',
      year_built: null as number | null,
      total_sf: null as number | null,
      status: 'active',
      description: '',
      features: [] as string[],
      
      // Address
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'USA',
      
      // Financial Metrics
      noi: null as number | null,
      cap_rate: null as number | null,
      occupancy_rate: null as number | null,
      property_value: null as number | null,
      price_per_sf: null as number | null,
      
      // Tenants (simplified for MVP)
      tenants: [] as Array<{
        name: string;
        lease_start?: string;
        lease_end?: string;
        sf_leased?: number;
        monthly_rent?: number;
        notes?: string;
      }>,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Property name is required'),
      property_type: (value) => (value ? null : 'Property type is required'),
      street: (value) => (value.trim().length > 0 ? null : 'Street address is required'),
      city: (value) => (value.trim().length > 0 ? null : 'City is required'),
      state: (value) => (value.trim().length > 0 ? null : 'State is required'),
      zip_code: (value) => (value.trim().length > 0 ? null : 'ZIP code is required'),
    },
  });

  const nextStep = () => {
    const currentStepFields = [
      // Step 1: Basic Info
      ['name', 'property_type', 'status', 'description'],
      // Step 2: Address
      ['street', 'city', 'state', 'zip_code'],
      // Step 3: Financial Metrics
      [],
    ][active];

    const hasErrors = currentStepFields.some((field) => {
      const error = form.validateField(field).error;
      return !!error;
    });

    if (!hasErrors) {
      setActive((current) => (current < 3 ? current + 1 : current));
    }
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      // Transform form values to match the Property type
      const propertyData = {
        name: values.name,
        property_type: values.property_type,
        property_class: values.property_class || undefined,
        year_built: values.year_built || undefined,
        total_sf: values.total_sf || undefined,
        status: values.status,
        description: values.description || undefined,
        features: values.features,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          country: values.country,
        },
        financial_metrics: {
          noi: values.noi || undefined,
          cap_rate: values.cap_rate ? values.cap_rate / 100 : undefined, // Convert percentage to decimal
          occupancy_rate: values.occupancy_rate ? values.occupancy_rate / 100 : undefined, // Convert percentage to decimal
          property_value: values.property_value || undefined,
          price_per_sf: values.price_per_sf || undefined,
        },
        tenants: values.tenants,
      };

      await createProperty(propertyData);
      router.push('/properties');
    } catch (err) {
      console.error('Error creating property:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = authLoading || propertiesLoading;

  if (isLoading && !submitting) {
    return (
      <Container>
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Group position="apart" mb="xl">
        <div>
          <Title>Add New Property</Title>
          <Text color="dimmed">Create a new property in your portfolio</Text>
        </div>
        <Button 
          leftIcon={<IconArrowLeft size={16} />} 
          variant="outline"
          onClick={() => router.push('/properties')}
        >
          Back to Properties
        </Button>
      </Group>

      {error && (
        <Paper p="md" mb="lg" withBorder sx={{ backgroundColor: '#FFF4F4' }}>
          <Text color="red">{error}</Text>
        </Paper>
      )}

      <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
        <Stepper active={active} onStepClick={setActive} breakpoint="sm" mb="xl">
          <Stepper.Step 
            label="Basic Info" 
            description="Property details" 
            icon={<IconBuilding size={18} />}
          >
            <Box mt="md">
              <TextInput
                label="Property Name"
                placeholder="Enter property name"
                required
                {...form.getInputProps('name')}
                mb="md"
              />
              
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Property Type"
                    placeholder="Select property type"
                    required
                    data={[
                      { value: 'office', label: 'Office' },
                      { value: 'retail', label: 'Retail' },
                      { value: 'industrial', label: 'Industrial' },
                      { value: 'multifamily', label: 'Multifamily' },
                      { value: 'mixed_use', label: 'Mixed Use' },
                    ]}
                    {...form.getInputProps('property_type')}
                    mb="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Property Class"
                    placeholder="Select property class"
                    data={[
                      { value: 'A', label: 'Class A' },
                      { value: 'B', label: 'Class B' },
                      { value: 'C', label: 'Class C' },
                    ]}
                    {...form.getInputProps('property_class')}
                    mb="md"
                  />
                </Grid.Col>
              </Grid>
              
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Year Built"
                    placeholder="Enter year built"
                    min={1800}
                    max={new Date().getFullYear()}
                    {...form.getInputProps('year_built')}
                    mb="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Total Square Footage"
                    placeholder="Enter total SF"
                    min={0}
                    {...form.getInputProps('total_sf')}
                    mb="md"
                  />
                </Grid.Col>
              </Grid>
              
              <Select
                label="Status"
                placeholder="Select status"
                required
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                {...form.getInputProps('status')}
                mb="md"
              />
              
              <Textarea
                label="Description"
                placeholder="Enter property description"
                minRows={3}
                {...form.getInputProps('description')}
                mb="md"
              />
              
              <MultiSelect
                label="Features"
                placeholder="Select property features"
                data={[
                  { value: 'parking', label: 'Parking' },
                  { value: 'elevator', label: 'Elevator' },
                  { value: 'security', label: 'Security System' },
                  { value: 'fitness_center', label: 'Fitness Center' },
                  { value: 'conference_room', label: 'Conference Room' },
                  { value: 'rooftop', label: 'Rooftop Access' },
                  { value: 'lobby', label: 'Lobby' },
                  { value: 'hvac', label: 'HVAC System' },
                ]}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add "${query}"`}
                onCreate={(query) => {
                  const item = { value: query.toLowerCase(), label: query };
                  return item;
                }}
                {...form.getInputProps('features')}
                mb="md"
              />
            </Box>
          </Stepper.Step>
          
          <Stepper.Step 
            label="Location" 
            description="Address details" 
            icon={<IconMapPin size={18} />}
          >
            <Box mt="md">
              <TextInput
                label="Street Address"
                placeholder="Enter street address"
                required
                {...form.getInputProps('street')}
                mb="md"
              />
              
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="City"
                    placeholder="Enter city"
                    required
                    {...form.getInputProps('city')}
                    mb="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="State"
                    placeholder="Enter state"
                    required
                    {...form.getInputProps('state')}
                    mb="md"
                  />
                </Grid.Col>
              </Grid>
              
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="ZIP Code"
                    placeholder="Enter ZIP code"
                    required
                    {...form.getInputProps('zip_code')}
                    mb="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Country"
                    placeholder="Enter country"
                    {...form.getInputProps('country')}
                    mb="md"
                  />
                </Grid.Col>
              </Grid>
            </Box>
          </Stepper.Step>
          
          <Stepper.Step 
            label="Financials" 
            description="Financial metrics" 
            icon={<IconChartBar size={18} />}
          >
            <Box mt="md">
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Net Operating Income (NOI)"
                    placeholder="Enter NOI"
                    min={0}
                    precision={2}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value))
                        ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                        : '$ '
                    }
                    {...form.getInputProps('noi')}
                    mb="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Cap Rate (%)"
                    placeholder="Enter cap rate"
                    min={0}
                    max={100}
                    precision={2}
                    {...form.getInputProps('cap_rate')}
                    mb="md"
                  />
                </Grid.Col>
              </Grid>
              
              <Grid>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Occupancy Rate (%)"
                    placeholder="Enter occupancy rate"
                    min={0}
                    max={100}
                    precision={2}
                    {...form.getInputProps('occupancy_rate')}
                    mb="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput
                    label="Property Value"
                    placeholder="Enter property value"
                    min={0}
                    precision={2}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={(value) =>
                      !Number.isNaN(parseFloat(value))
                        ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                        : '$ '
                    }
                    {...form.getInputProps('property_value')}
                    mb="md"
                  />
                </Grid.Col>
              </Grid>
              
              <NumberInput
                label="Price per Square Foot"
                placeholder="Enter price per SF"
                min={0}
                precision={2}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                formatter={(value) =>
                  !Number.isNaN(parseFloat(value))
                    ? `$ ${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : '$ '
                }
                {...form.getInputProps('price_per_sf')}
                mb="md"
              />
              
              <Text size="sm" color="dimmed" mt="lg">
                Note: Tenant information can be added after creating the property.
              </Text>
            </Box>
          </Stepper.Step>
          
          <Stepper.Completed>
            <Box mt="md">
              <Title order={3} mb="md">Review Property Information</Title>
              
              <Paper p="md" withBorder mb="md">
                <Title order={4} mb="xs">Basic Information</Title>
                <Text><strong>Name:</strong> {form.values.name}</Text>
                <Text><strong>Type:</strong> {form.values.property_type}</Text>
                {form.values.property_class && (
                  <Text><strong>Class:</strong> {form.values.property_class}</Text>
                )}
                {form.values.year_built && (
                  <Text><strong>Year Built:</strong> {form.values.year_built}</Text>
                )}
                {form.values.total_sf && (
                  <Text><strong>Total SF:</strong> {form.values.total_sf.toLocaleString()}</Text>
                )}
                <Text><strong>Status:</strong> {form.values.status}</Text>
                {form.values.description && (
                  <Text><strong>Description:</strong> {form.values.description}</Text>
                )}
              </Paper>
              
              <Paper p="md" withBorder mb="md">
                <Title order={4} mb="xs">Location</Title>
                <Text>{form.values.street}</Text>
                <Text>{form.values.city}, {form.values.state} {form.values.zip_code}</Text>
                <Text>{form.values.country}</Text>
              </Paper>
              
              <Paper p="md" withBorder mb="md">
                <Title order={4} mb="xs">Financial Information</Title>
                {form.values.noi && (
                  <Text><strong>NOI:</strong> ${form.values.noi.toLocaleString()}</Text>
                )}
                {form.values.cap_rate && (
                  <Text><strong>Cap Rate:</strong> {form.values.cap_rate}%</Text>
                )}
                {form.values.occupancy_rate && (
                  <Text><strong>Occupancy Rate:</strong> {form.values.occupancy_rate}%</Text>
                )}
                {form.values.property_value && (
                  <Text><strong>Property Value:</strong> ${form.values.property_value.toLocaleString()}</Text>
                )}
                {form.values.price_per_sf && (
                  <Text><strong>Price per SF:</strong> ${form.values.price_per_sf}</Text>
                )}
              </Paper>
              
              <Text size="sm" color="dimmed" mb="lg">
                Please review the information above before submitting. You can go back to make changes if needed.
              </Text>
            </Box>
          </Stepper.Completed>
        </Stepper>

        <Group position="right" mt="xl">
          {active !== 0 && (
            <Button variant="default" onClick={prevStep}>
              Back
            </Button>
          )}
          {active !== 3 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={() => form.onSubmit(handleSubmit)()}
              loading={submitting}
            >
              Submit
            </Button>
          )}
        </Group>
      </Card>
    </Container>
  );
};

export default NewPropertyPage;
