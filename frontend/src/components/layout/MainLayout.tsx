import React, { ReactNode, useState } from 'react';
import { 
  AppShell, 
  Header, 
  Text, 
  MediaQuery, 
  Burger, 
  useMantineTheme, 
  Group, 
  Button,
  Container,
  Box,
  Avatar,
  Menu,
  Divider
} from '@mantine/core';
import { 
  IconHome, 
  IconDashboard, 
  IconBuilding, 
  IconFileText, 
  IconChartBar, 
  IconUser, 
  IconLogout,
  IconChevronDown
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import ParticlesBackground from './ParticlesBackground';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  const navItems = [
    { label: 'Dashboard', icon: <IconDashboard size={20} />, path: '/dashboard' },
    { label: 'Properties', icon: <IconBuilding size={20} />, path: '/properties' },
    { label: 'Documents', icon: <IconFileText size={20} />, path: '/documents' },
    { label: 'Analyses', icon: <IconChartBar size={20} />, path: '/analyses' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppShell
      styles={{
        main: {
          background: 'var(--abare-dark-bg)',
          color: 'var(--abare-text)',
          padding: 0,
        },
      }}
      header={
        <Header height={70} p="md" style={{ 
          background: 'rgba(9, 14, 36, 0.8)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--abare-card-border)'
        }}>
          <Container size="xl">
            <Group position="apart" style={{ height: '100%' }}>
              <Group>
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                  <Burger
                    opened={opened}
                    onClick={() => setOpened((o) => !o)}
                    size="sm"
                    color="var(--abare-text)"
                    mr="xl"
                  />
                </MediaQuery>

                <Link href="/" passHref legacyBehavior>
                  <a className="logo-glow">
                    <Text component="span" className="gradient-text" size="xl" weight={700}>
                      ABARE Platform
                    </Text>
                  </a>
                </Link>
              </Group>

              <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                <Group spacing="xl">
                  {navItems.map((item) => (
                    <Link key={item.path} href={item.path} passHref legacyBehavior>
                      <Button
                        component="a"
                        variant="subtle"
                        color="gray"
                        className={isActive(item.path) ? 'gradient-border' : ''}
                        leftIcon={item.icon}
                        styles={{
                          root: {
                            color: isActive(item.path) ? 'var(--abare-blue)' : 'var(--abare-text)',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)'
                            }
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </Group>
              </MediaQuery>

              {user ? (
                <Menu position="bottom-end">
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      color="gray"
                      styles={{
                        root: {
                          color: 'var(--abare-text)',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)'
                          }
                        }
                      }}
                    >
                      <Group spacing="xs">
                        <Avatar color="blue" radius="xl" size="sm">
                          {user.full_name ? user.full_name.charAt(0) : user.email.charAt(0)}
                        </Avatar>
                        <Text size="sm" weight={500}>
                          {user.full_name || user.email}
                        </Text>
                        <IconChevronDown size={16} />
                      </Group>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown
                    sx={{
                      background: 'var(--abare-dark-card)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--abare-card-border)'
                    }}
                  >
                    <Menu.Item icon={<IconUser size={16} />}>Profile</Menu.Item>
                    <Divider />
                    <Menu.Item 
                      color="red" 
                      icon={<IconLogout size={16} />} 
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Group>
                  <Link href="/login" passHref legacyBehavior>
                    <Button
                      component="a"
                      variant="outline"
                      styles={{
                        root: {
                          borderColor: 'var(--abare-blue)',
                          color: 'var(--abare-blue)'
                        }
                      }}
                    >
                      Login
                    </Button>
                  </Link>
                </Group>
              )}
            </Group>
          </Container>
        </Header>
      }
    >
      <ParticlesBackground />
      <Box className="main-content">
        <Container size="xl">{children}</Container>
      </Box>
    </AppShell>
  );
} 

export default MainLayout;
