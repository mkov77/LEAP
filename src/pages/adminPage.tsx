// pages/adminPage.js
import React, { useState, useEffect, useRef } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Skeleton,
  Image,
  Box,
  Table,
  Checkbox,
  Button,
  Modal,
  TextInput,
  useMantineTheme,
  MantineProvider,
  useMantineColorScheme,
  useComputedColorScheme,
  FocusTrap,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
//import { sections as initialSections } from '../data/sections';
import { useUserRole } from '../context/UserContext';
import { FaSun, FaMoon, FaArrowAltCircleLeft } from "react-icons/fa";
import axios from 'axios';
import { Section } from './landingPage';


function AdminPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  //const [sections, setSections] = useState(initialSections);
  const theme = useMantineTheme();
  const [newSectionName, setNewSectionName] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();

  useEffect(() => {
    if (userRole !== 'Administrator') {
      navigate('/');
    }
  }, [navigate, userRole]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleArrowClick = () => {
    navigate('/');
  };

  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Section[]>('http://10.0.1.226:5000/api/sections');
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trapRef.current) {
      trapRef.current.focus();
    }
  }, []);

  const handleCheckboxChange = (sectionid: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionid) ? prev.filter((id) => id !== sectionid) : [...prev, sectionid]
    );
  };


  const handleCreateNewSection = async () => {
    if (newSectionName.trim()) {
      try {
        // Make POST request to backend
        const response = await axios.post('http://10.0.1.226:5000/api/sections', {
          sectionid: newSectionName.trim(),
          isonline: false, // Default to offline
        });

        // Assuming successful creation, update frontend state
        setSections((prevSections) => [
          ...prevSections,
          { sectionid: newSectionName.trim(), isonline: false },
        ]);
        setNewSectionName('');
        closeModal();
      } catch (error) {
        console.error('Error creating new section:', error);
        // Add any error handling for the frontend here
      }
    }
  };

  const handleLaunchSession = (sectionid: string) => {
    setUserSection(selectedSection);
    navigate(`/sectionControls/${sectionid}`);
  }

  const openModal = () => {
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
  };


  const handleDeleteSections = async () => {
    try {
      console.log("Section ID: ", selectedSections);
      // Delete selected sections from the database
      await Promise.all(
        selectedSections.map((sectionId) =>
          axios.delete(`http://10.0.1.226:5000/api/sections/${sectionId}`)
        )
      );

      // Update the state after successful deletion
      setSections((prevSections) =>
        prevSections.filter((section) => !selectedSections.includes(section.sectionid))
      );
      setSelectedSections([]);
    } catch (error) {
      console.error('Error deleting sections:', error);
    }
  };

  const handleRowDoubleClick = (sectionid: string) => {
    setUserSection(sectionid);
    navigate(`/sectionControls/${sectionid}`);
  };

  // Function to render the sections table
  const renderSectionsTable = () => (
    <Box style={{ maxWidth: 600, margin: '0 auto' }}>
      <Table>
        <thead>
          <tr>
            <th>Section ID</th>
            <th>Is Online</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr
              key={section.sectionid}
              onClick={() => setSelectedSection(section.sectionid)}
              onDoubleClick={() => handleRowDoubleClick(section.sectionid)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedSection === section.sectionid ? theme.colors.gray[0] : '',
              }}
            >
              <td>{section.sectionid}</td>
              <td>
                <Box
                  style={{
                    backgroundColor: section.isonline ? theme.colors.green[0] : theme.colors.red[0],
                    color: section.isonline ? theme.colors.green[9] : theme.colors.red[9],
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  {section.isonline ? 'Online' : 'Offline'}
                </Box>
              </td>
              <td>
                <Checkbox
                  checked={selectedSections.includes(section.sectionid)}
                  onChange={() => handleCheckboxChange(section.sectionid)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );

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
          <div className="App">
            <h1>Admin Page</h1>
            {renderSectionsTable()}
            <div style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
              <Button
                style={{ height: '30px', width: '250px', textAlign: "center" }}
                mt="xl"
                size="md"
                onClick={() => selectedSection && handleLaunchSession(selectedSection)} // Update route
                disabled={!selectedSection}
              >
                Launch Session
              </Button>
            </div>
            <Group mt="md" style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
              <Button color="blue" onClick={openModal} style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                New Section
              </Button>
              <Button color="red" onClick={handleDeleteSections} disabled={selectedSections.length === 0}>
                Delete
              </Button>
            </Group>
          </div>
        </AppShell.Main>
        <Modal opened={modalOpened} onClose={closeModal} title="New Section" centered>
          <FocusTrap>
            <div>
              <TextInput
                autoFocus
                label="Section Name"
                placeholder="Enter section name"
                value={newSectionName}
                onChange={(event) => setNewSectionName(event.currentTarget.value)}
              />

              <Button fullWidth mt="md" onClick={handleCreateNewSection} disabled={!newSectionName.trim()}>
                Create
              </Button>
            </div>
          </FocusTrap>
        </Modal>
      </AppShell>
    </MantineProvider>
  );
}

export default AdminPage;
