import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell, Burger, Group, Table, useMantineTheme, Image, Button, Text, Box, Switch, rem, Divider, Alert, useMantineColorScheme, useComputedColorScheme, MantineProvider, SegmentedControl, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import { engagements } from '../data/engagements';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import { useUserRole } from '../context/UserContext';
import { FaSun, FaMoon, FaArrowAltCircleLeft } from "react-icons/fa";
import Hierarchy from '../components/HierarchyBuilder';
import { UserRoleProvider } from '../context/UserContext';
import axios from 'axios';
// export interface Engagement {
//   engagementID: string;
//   sectionID: string;
//   timeStamp: string;
//   friendlyID: string;
//   enemyID: string;
//   isWin: boolean;
//   friendlyHealth: number;
//   enemyHealth: number;
//   isCurrentState: boolean;
// }

function SectionControls() {
  const { sectionId } = useParams<{ sectionId: string }>();
  // const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [hierarchyToggle, setHierarchyToggle] = useState(false);
  const navigate = useNavigate();
  const theme = useMantineTheme();
  // const [engagementsData, setEngagementsData] = useState<Engagement[]>([]);
  const [sectionOnline, setSectionOnline] = useState(false);
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const [isFriendlyHierarchy, setIsFriendlyHierarchy] = useState('Friendly');
  const [refreshHierarchy, setRefreshHierarchy] = useState(0);

  setUserSection(sectionId);

  useEffect(() => {
    if (userRole !== 'Administrator') {
      navigate('/');
    }
  }, [navigate, userRole]);

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await fetch(`http://10.0.1.226:5000/api/sections/${sectionId}`);
        if (response.ok) {
          const sectionData = await response.json();
          setSectionOnline(sectionData.isonline);
        } else {
          console.error('Failed to fetch section data');
        }
      } catch (error) {
        console.error('Error fetching section data:', error);
      }
    };

    fetchSectionData();
  }, [sectionId]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleArrowClick = () => {
    navigate('/admin');
  };

  const handleClear = async () => {
    setRefreshHierarchy(prev => prev + 1);

    try {
      const response = await axios.put(`http://10.0.1.226:5000/api/units/remove`, {
        section: sectionId,
        is_friendly: (isFriendlyHierarchy === 'Friendly')
      });


    }
    catch (error){
      console.log("error clearing: ", error);
    }
    
  }

  const toggleSectionOnline = async () => {
    try {
      const response = await fetch(`http://10.0.1.226:5000/api/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isonline: !sectionOnline }),
      });

      if (!response.ok) {
        throw new Error('Failed to update section status');
      }

      setSectionOnline((prev) => !prev);
    } catch (error) {
      console.error('Error toggling section online status:', error);
    }
  };

  // useEffect(() => {
  //   const filteredEngagements = engagements.filter((engagement) => engagement.sectionID === sectionId);
  //   setEngagementsData(filteredEngagements);
  // }, [sectionId]);

  // const handleRowClick = (engagement: Engagement) => {
  //   setSelectedEngagement(engagement);
  // };

  // const restoreState = () => {
  //   if (selectedEngagement && !selectedEngagement.isCurrentState) {
  //     const updatedEngagements = engagementsData.map((engagement) =>
  //       engagement === selectedEngagement
  //         ? { ...engagement, isCurrentState: true }
  //         : { ...engagement, isCurrentState: false }
  //     );
  //     setEngagementsData(updatedEngagements);
  //   }
  // };

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
        </AppShell.Header>
        <AppShell.Main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1><strong>{sectionId}</strong> Controls </h1>
            <Button onClick={() => setHierarchyToggle(!hierarchyToggle)}>{!hierarchyToggle ? 'Hierarchy Builder' : 'Section Controls'}</Button>
          </div>
          <div>

          </div>



 
              <Divider my="md" />
              <Switch
                checked={sectionOnline}
                onChange={toggleSectionOnline}
                color={sectionOnline ? 'teal' : 'red'}
                size="md"
                label={sectionOnline ? 'Section Online' : 'Section Offline'}
                thumbIcon={
                  sectionOnline ? (
                    <IconCheck
                      style={{ width: rem(12), height: rem(12) }}
                      color={theme.colors.teal[6]}
                      stroke={3}
                    />
                  ) : (
                    <IconX
                      style={{ width: rem(12), height: rem(12) }}
                      color={theme.colors.red[6]}
                      stroke={3}
                    />
                  )
                }
              />
              <Divider my="md" />

                     {/*
              <Table style={{ marginTop: 20 }}>
                <thead>
                  <tr>
                    <th>Engagement ID</th>
                    <th>Section ID</th>
                    <th>Time Stamp</th>
                    <th>Friendly ID</th>
                    <th>Enemy ID</th>
                    <th>Is Win</th>
                    <th>Friendly Health</th>
                    <th>Enemy Health</th>
                    <th>Is Current State</th>
                  </tr>
                </thead>
                <tbody>
                  {engagementsData.map((engagement) => (
                    <tr
                      key={engagement.engagementID}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: selectedEngagement === engagement ? theme.colors.gray[0] : '',
                      }}
                      onClick={() => handleRowClick(engagement)}
                    >
                      <td>{engagement.engagementID}</td>
                      <td>{engagement.sectionID}</td>
                      <td>{engagement.timeStamp}</td>
                      <td>{engagement.friendlyID}</td>
                      <td>{engagement.enemyID}</td>
                      <td>
                        <Box
                          style={{
                            padding: '4px',
                            borderRadius: '4px',
                            backgroundColor: engagement.isWin ? theme.colors.green[0] : theme.colors.red[0],
                            color: engagement.isWin ? theme.colors.green[9] : theme.colors.red[9],
                          }}
                        >
                          {engagement.isWin.toString()}
                        </Box>
                      </td>
                      <td>{engagement.friendlyHealth}</td>
                      <td>{engagement.enemyHealth}</td>
                      <td>
                        <Box
                          style={{
                            padding: '4px',
                            borderRadius: '4px',
                            backgroundColor: engagement.isCurrentState ? theme.colors.green[0] : theme.colors.red[0],
                            color: engagement.isCurrentState ? theme.colors.green[9] : theme.colors.red[9],
                          }}
                        >
                          {engagement.isCurrentState.toString()}
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button
                disabled={!selectedEngagement || selectedEngagement.isCurrentState}
                onClick={restoreState}
                color="blue"
                style={{ marginTop: 20 }}
              >
                Restore state
              </Button> */}

              <Group>
                <SegmentedControl
                  value={isFriendlyHierarchy}
                  onChange={setIsFriendlyHierarchy}
                  size='xl'
                  data={[
                    { label: 'Friendly Hierarchy', value: 'Friendly' },
                    { label: 'Enemy Hierarchy', value: 'Enemy' }
                  ]}
                />
                <Button color='red' size="xl" justify='right' onClick={handleClear} >Clear</Button>
                
              </Group>
              <Hierarchy is_friendly={isFriendlyHierarchy === 'Friendly'} hierarchyRefresh={refreshHierarchy} />

        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default SectionControls;
