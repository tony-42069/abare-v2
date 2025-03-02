import React, { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Text, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register, error } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      fullName: (value) => (value.trim().length >= 3 ? null : 'Name must be at least 3 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: { fullName: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await register(values.email, values.password, values.fullName);
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
          label="Full Name"
          placeholder="John Doe"
          {...form.getInputProps('fullName')}
          mb="md"
        />

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

        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
          mb="md"
        />

        {error && (
          <Text color="red" size="sm" mb="md">
            {error}
          </Text>
        )}

        <Group position="apart" mt="lg">
          <Anchor component={Link} href="/login" size="sm">
            Already have an account? Login
          </Anchor>
          <Button type="submit" loading={isLoading}>
            Register
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default RegisterForm; 