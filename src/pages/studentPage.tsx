import '../App.css';
import AccordionC from '../components/Accordion'; // Remove the '.tsx' extension
import { AppShell, Burger, Group, Skeleton, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
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
            onClick={handleLogoClick} // Add onClick handler here
            style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickable
          />
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
          <h1>Welcome to the Student Page</h1>
          {sectionId && (
            <p>
              You are in section: <strong>{sectionId}</strong>
            </p>
          )}
        </div>
        <div className="App">
          <AccordionC />
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
