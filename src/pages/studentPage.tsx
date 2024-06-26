import '../App.css';
import CarouselC from '../components/carousel'; // Remove the '.tsx' extension
import SearchResultList from '../components/searchResults'
import { AppShell, Burger, Group, Skeleton, Image, TextInput, useMantineColorScheme, useComputedColorScheme, Button, MantineProvider, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserRole } from '../context/UserContext';
import { useUnitProvider } from '../context/UnitContext';
import { FaSun, FaMoon, FaArrowAltCircleLeft } from "react-icons/fa";
import Hierarchy from '../components/HierarchyBuilder';

function App() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const [hierarchyToggle, setHierarchyToggle] = useState(false);

  useEffect(() => {
    if (userRole !== 'Student' || userSection !== sectionId) {
      console.log(`user Role: ${userRole}`);
      console.log(`user section: ${sectionId}`);
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

  const handleArrowClick = () => {
    navigate('/');
  };

  const handleAARClick = () => {
    navigate(`/AAR/${sectionId}`)
  }

  return (
    <MantineProvider defaultColorScheme='dark'>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button size='sm' variant='link' onClick={handleArrowClick} style={{ margin: '10px' }}>
                <FaArrowAltCircleLeft />
              </Button>
              <Image
                src='https://github.com/mkov77/LEAP/blob/main/Tr_FullColor_NoSlogan.png?raw=true'
                radius="md"
                h={50}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer', scale: '1', padding: '8px' }}
              />
            </div>

          </div>

        </AppShell.Header>

        <AppShell.Main>
          <div style={{justifyContent:'right', display:'flex'}}>
            <Button size='sm' variant='link' onClick={handleAARClick} style={{ margin: '10px ' }}>After Action Reports</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h1>Welcome to the Student Page</h1>
              {sectionId && (
                <p>
                  You are in section: <strong>{sectionId}</strong>
                </p>
              )}
              {!hierarchyToggle && (
                <TextInput
                  placeholder='Search'
                  style={{ width: '100%' }}
                  value={search}
                  onChange={handleChange}
                />
              )}

            </div>
            <div>
              <Button onClick={() => setHierarchyToggle(!hierarchyToggle)}>
                {hierarchyToggle ? 'Selection Menu' : 'Hierarchy View'}
              </Button>
            </div>
          </div>
          <div className="App">
            {!hierarchyToggle ? (
              <>
                {search && (
                  <SearchResultList search={search} />
                )}
                {!search && (
                  <CarouselC />
                )}
                <Group justify='center'>
                  <Button
                    disabled={!selectedUnit}
                    size='compact-xl'
                    onClick={() => navigate(`/battlePage`)}
                    style={{ margin: '30px' }}
                  >
                    Select for Engagement
                  </Button>
                </Group>
              </>
            ) : (
              <Hierarchy />
            )}
          </div>
        </AppShell.Main>
      </AppShell>
    </MantineProvider >
  );
}

export default App;
