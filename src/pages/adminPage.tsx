// pages/adminPage.js
import React, { useState, useEffect } from 'react';
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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { sections as initialSections } from '../data/sections';
import { useUserRole } from '../context/UserContext';

function AdminPage() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [sections, setSections] = useState(initialSections);
  const theme = useMantineTheme();
  const [newSectionName, setNewSectionName] = useState('');
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const { userRole, setUserRole } = useUserRole();

  useEffect(() => {
    if (userRole !== 'Administrator') {
      navigate('/');
    }
  }, [navigate, userRole]);

  const handleLogoClick = () => {
    navigate('/');
  };

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
          {renderSectionsTable()}
          <Group mt="md">
            <Button color="blue" onClick={openModal}>
              New Section
            </Button>
            <Button color="red" onClick={handleDeleteSections} disabled={selectedSections.length === 0}>
              Delete
            </Button>
          </Group>
        </div>
      </AppShell.Main>

      <Modal opened={modalOpened} onClose={closeModal} title="New Section" centered>
        <TextInput
          label="Section Name"
          placeholder="Enter section name"
          value={newSectionName}
          onChange={(event) => setNewSectionName(event.currentTarget.value)}
        />
        <Button fullWidth mt="md" onClick={handleCreateNewSection} disabled={!newSectionName.trim()}>
          Create
        </Button>
      </Modal>
    </AppShell>
  );
}

export default AdminPage;
