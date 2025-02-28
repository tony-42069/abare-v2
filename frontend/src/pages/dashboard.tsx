import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Container, Title, Grid, Card, Text, Group, RingProgress, SimpleGrid, Paper } from '@mantine/core';
import { MainLayout } from '../components/Layout/MainLayout';

const Dashboard: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Dashboard - ABARE Platform</title>
      </Head>
      
      <Container size="lg" py={20}>
        <Title order={1} mb={30}>Dashboard</Title>
        
        <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 }, { maxWidth: 'md', cols: 2 }]} mb={30}>
          <Card p="md" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                  Total Reports
                </Text>
                <Text weight={700} size="xl">
                  128
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 65, color: 'blue' }]}
                label={
                  <Text color="blue" weight={700} align="center" size="lg">
                    65%
                  </Text>
                }
              />
            </Group>
          </Card>
          
          <Card p="md" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                  Active Users
                </Text>
                <Text weight={700} size="xl">
                  42
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 82, color: 'green' }]}
                label={
                  <Text color="green" weight={700} align="center" size="lg">
                    82%
                  </Text>
                }
              />
            </Group>
          </Card>
          
          <Card p="md" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                  Data Sets
                </Text>
                <Text weight={700} size="xl">
                  56
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 45, color: 'orange' }]}
                label={
                  <Text color="orange" weight={700} align="center" size="lg">
                    45%
                  </Text>
                }
              />
            </Group>
          </Card>
          
          <Card p="md" radius="md" withBorder>
            <Group position="apart">
              <div>
                <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
                  Pending Tasks
                </Text>
                <Text weight={700} size="xl">
                  12
                </Text>
              </div>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 25, color: 'red' }]}
                label={
                  <Text color="red" weight={700} align="center" size="lg">
                    25%
                  </Text>
                }
              />
            </Group>
          </Card>
        </SimpleGrid>
        
        <Grid gutter="md">
          <Grid.Col span={8}>
            <Paper p="md" radius="md" withBorder>
              <Title order={3} mb={15}>Recent Activity</Title>
              <Text>This is where charts and activity logs would be displayed.</Text>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={4}>
            <Paper p="md" radius="md" withBorder>
              <Title order={3} mb={15}>Notifications</Title>
              <Text>This is where notifications would be displayed.</Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    </MainLayout>
  );
};

export default Dashboard; 