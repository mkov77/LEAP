// pages/adminPage.js
import React, { useState, useEffect, useRef} from 'react';
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
import { sections as initialSections } from '../data/sections';
import { useUserRole } from '../context/UserContext';
import { FaSun, FaMoon, FaArrowAltCircleLeft} from "react-icons/fa";


function AdminPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sections, setSections] = useState(initialSections);
  const theme = useMantineTheme();
  const [newSectionName, setNewSectionName] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const { userRole, setUserRole, userSection, setUserSection} = useUserRole();

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

  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trapRef.current) {
      trapRef.current.focus();
    }
  }, []);

  const handleCheckboxChange = (sectionID: string) => {
    setSelectedSections((prev) =>
      prev.includes(sectionID) ? prev.filter((id) => id !== sectionID) : [...prev, sectionID]
    );
  };


  const handleCreateNewSection = () => {
    if (newSectionName.trim()) {
      setSections((prevSections) => [
        ...prevSections,
        { sectionID: newSectionName.trim(), isOnline: false }, // Default to offline
      ]);
      setNewSectionName('');
      closeModal();
    }
  };

  const handleLaunchSession = (sectionID: string) => {
    setUserSection(selectedSection);
    navigate(`/sectionControls/${sectionID}`);
  }

  const openModal = () => {
    setModalOpened(true);
  };

  const closeModal = () => {
    setModalOpened(false);
  };


  const handleDeleteSections = () => {
    setSections((prevSections) =>
      prevSections.filter((section) => !selectedSections.includes(section.sectionID))
    );
    setSelectedSections([]);
  };

  const handleRowDoubleClick = (sectionID: string) => {
    navigate(`/sectionControls/${sectionID}`);
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
              key={section.sectionID}
              onClick={() => setSelectedSection(section.sectionID)}
              onDoubleClick={() => handleRowDoubleClick(section.sectionID)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedSection === section.sectionID ? theme.colors.gray[0] : '',
              }}
            >
              <td>{section.sectionID}</td>
              <td>
                <Box
                  style={{
                    backgroundColor: section.isOnline ? theme.colors.green[0] : theme.colors.red[0],
                    color: section.isOnline ? theme.colors.green[9] : theme.colors.red[9],
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'inline-block',
                  }}
                >
                  {section.isOnline ? 'Online' : 'Offline'}
                </Box>
              </td>
              <td>
                <Checkbox
                  checked={selectedSections.includes(section.sectionID)}
                  onChange={() => handleCheckboxChange(section.sectionID)}
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
          <Group h="100%" px="md">
            <Group>
              <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
              <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            </Group>
            <Button size='sm' variant='link' onClick={handleArrowClick}><FaArrowAltCircleLeft /> </Button>
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
            {renderSectionsTable()}
            <div style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
                <Button
                  style={{height: '30px', width: '250px',textAlign: "center"}}
                  mt="xl"
                  size="md"
                  onClick={() => selectedSection && handleLaunchSession(selectedSection)} // Update route
                  disabled={!selectedSection}
                >
                  Launch Session
              </Button>
              </div>
            <Group mt="md" style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
              <Button color="blue" onClick={openModal} style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
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
