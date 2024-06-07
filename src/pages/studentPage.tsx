import '../App.css';
import CarouselC from '../components/carousel'; // Remove the '.tsx' extension
import SearchResultList from '../components/searchResults'
import { AppShell, Burger, Group, Skeleton, Image, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserRole } from '../context/UserContext';


function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();

  useEffect(() => {
    if (userRole !== 'Student' || userSection !== sectionId) {
      navigate('/');
    }
  }, [navigate, userRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearch(value);
  }
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
        <Group h="100%" justify="space-between" px="md" align="center">
          <Image
            src={null}
            radius="md"
            h={50}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
            onClick={handleLogoClick} // Add onClick handler here
            style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickable
          />
          <TextInput
            placeholder='Search'
            style={{ width:'30%',  }}
            value={search}
            onChange={handleChange}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <div>
          <h1>Welcome to the Student Page</h1>
          {sectionId && (
            <p>
              You are in section: <strong>{sectionId}</strong>
            </p>
          )}
        </div>
        {search ? (
        <>
        <div className="App">
          <SearchResultList search={search} />
        </div>
        </>
        ) : (
        <div className="App">
          <CarouselC />
        </div>
        )
      }
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
