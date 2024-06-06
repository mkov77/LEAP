import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell, Burger, Group, Table, useMantineTheme, Image, Button, Box, Switch, rem, Divider, Alert} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { engagements } from '../data/engagements';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';

export interface Engagement {
  engagementID: string;
  sectionID: string;
  timeStamp: string;
  friendlyID: string;
  enemyID: string;
  isWin: boolean;
  friendlyHealth: number;
  enemyHealth: number;
  isCurrentState: boolean;
}

function SectionControls() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const [selectedEngagement, setSelectedEngagement] = useState<Engagement | null>(null);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [engagementsData, setEngagementsData] = useState<Engagement[]>([]);
  const [sectionOnline, setSectionOnline] = useState(false); // Added state for sectionOnline

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

  useEffect(() => {
    // Filter engagements data based on sectionId
    const filteredEngagements = engagements.filter((engagement) => engagement.sectionID === sectionId);
    setEngagementsData(filteredEngagements);
  }, [sectionId]);

  const handleRowClick = (engagement: Engagement) => {
    setSelectedEngagement(engagement);
  };

  const restoreState = () => {
    if (selectedEngagement && !selectedEngagement.isCurrentState) {
      const updatedEngagements = engagementsData.map((engagement) =>
        engagement === selectedEngagement
          ? { ...engagement, isCurrentState: true }
          : { ...engagement, isCurrentState: false } // Set others to false
      );
      setEngagementsData(updatedEngagements);
    }
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
        Navbar
      </AppShell.Navbar>
      <AppShell.Main>
        <div>
          <h1><strong>{sectionId}</strong> Controls </h1>
          <Divider my="md" />
          <Switch
      checked={sectionOnline}
      onChange={() => setSectionOnline((prev) => !prev)}
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
        </div>
        <div>
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
          </Button>
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default SectionControls;
