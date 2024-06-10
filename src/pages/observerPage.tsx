import '../App.css';
import React, { useEffect } from 'react';
import CarouselC from '../components/carousel'; // Remove the '.tsx' extension
import { AppShell, Burger, Group, Skeleton, Image, useMantineColorScheme, useComputedColorScheme, Button, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserRole } from '../context/UserContext';
import { FaSun, FaMoon } from "react-icons/fa";

function ObserverPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const {setColorScheme} = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light');


  useEffect(() => {
    if (userRole !== 'Observer' || userSection !== userSection) {
      navigate('/');
    }
  }, [navigate, userRole]);

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

  const togglecolorScheme = () => {
    setColorScheme(computedColorScheme === "dark" ? 'light' : 'dark')
  }

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
          <Button size='sm' variant='link' onClick={togglecolorScheme}>{computedColorScheme === "dark" ? <FaSun /> : <FaMoon />} </Button>
          <Image
            src={null}
            radius="md"
            h={50}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            onClick={handleLogoClick} // Add onClick handler here
            style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickable
          />
        </Group>
        <Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <div>
          <h1>Welcome to the Observer Page: {userRole}</h1>
          <h2>Role: {userRole} </h2>
          {sectionId && (
            <p>
              You are observing section: <strong>{sectionId}</strong>
            </p>
          )}
        </div>
        <div className="App">
          <CarouselC />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default ObserverPage;
