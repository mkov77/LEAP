// src/pages/AdminPage.tsx
import { AppShell, Burger, Group, Skeleton, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group>
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          </Group>
          <Image
            src={null}
            radius="md"
            h={50}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        Admin Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <div className="App">
          <h1>Admin Page</h1>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default AdminPage;