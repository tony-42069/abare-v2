import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { 
  TextInput, 
  PasswordInput, 
  Paper, 
  Title, 
  Container, 
  Button, 
  Text, 
  Anchor, 
  Group,
  Stack
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { login } from '../services/auth';
import { LoginCredentials } from '../types';

const Login: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password should be at least 6 characters'),
    },
  });

  const handleSubmit = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      await login(values);
      showNotification({
        title: 'Login successful',
        message: 'You have been logged in successfully',
        color: 'green',
      });
      router.push('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An error occurred during login';
      
      showNotification({
        title: 'Login failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - ABARE Platform</title>
      </Head>
      <Container size={420} my={40}>
        <Title align="center" sx={() => ({ fontWeight: 900 })}>
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Don&apos;t have an account yet?{' '}
          <Link href="/register" passHref>
            <Anchor size="sm" component="a">
              Create account
            </Anchor>
          </Link>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="you@example.com"
                required
                {...form.getInputProps('email')}
              />
              
              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                {...form.getInputProps('password')}
              />
              
              <Group position="apart" mt="md">
                <Anchor component="button" size="sm">
                  Forgot password?
                </Anchor>
              </Group>
              
              <Button fullWidth mt="xl" type="submit" loading={loading}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default Login; 