import React from 'react';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>ABARE Platform - Home</title>
        <meta name="description" content="ABARE Platform - Agricultural Data Analysis" />
      </Head>

      <Container size="lg" py={50}>
        <Stack spacing="xl">
          <Title order={1} align="center" mb={30}>
            Welcome to the ABARE Platform
          </Title>
          
          <Text size="lg" align="center" mb={30}>
            A comprehensive platform for agricultural data analysis and reporting
          </Text>

          <Group position="center" spacing="md">
            <Link href="/dashboard" passHref>
              <Button component="a" size="lg" variant="filled">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/about" passHref>
              <Button component="a" size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </Group>
        </Stack>
      </Container>
    </>
  );
};

export default Home; 