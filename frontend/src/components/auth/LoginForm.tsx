import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      // Error is handled in the auth context
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
          mb="md"
        />

        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          mb="md"
        />

        {error && (
          <Text color="red" size="sm" mb="md">
            {error}
          </Text>
        )}

        <Group position="apart" mt="lg">
          <Anchor component={Link} href="/register" size="sm">
            Don&apos;t have an account? Register
          </Anchor>
          <Button type="submit" loading={isLoading}>
            Login
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default LoginForm; 