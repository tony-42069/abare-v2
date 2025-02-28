import React, { ReactNode } from 'react';
import { AppShell, Header, Navbar, Text, MediaQuery, Burger, useMantineTheme, Group, Button } from '@mantine/core';
import { useState } from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Navbar.Section>
            <Text weight={500} size="lg" mb="xs">Navigation</Text>
          </Navbar.Section>
          <Navbar.Section grow mt="md">
            <Link href="/" passHref>
              <Button component="a" variant="subtle" fullWidth leftIcon={<span>🏠</span>}>
                Home
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button component="a" variant="subtle" fullWidth leftIcon={<span>📊</span>}>
                Dashboard
              </Button>
            </Link>
            <Link href="/reports" passHref>
              <Button component="a" variant="subtle" fullWidth leftIcon={<span>📝</span>}>
                Reports
              </Button>
            </Link>
            <Link href="/settings" passHref>
              <Button component="a" variant="subtle" fullWidth leftIcon={<span>⚙️</span>}>
                Settings
              </Button>
            </Link>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Group position="apart" style={{ width: '100%' }}>
              <Text size="xl" weight={700}>ABARE Platform</Text>
              <Group>
                <Link href="/login" passHref>
                  <Button component="a" variant="outline">Login</Button>
                </Link>
              </Group>
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
} 