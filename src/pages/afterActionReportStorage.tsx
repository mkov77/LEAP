//afterActionReviewStorage.tsx
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
  ScrollArea,
  Anchor,
  Progress,
  Card,
  Text,
  Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSun, FaMoon, FaArrowAltCircleLeft } from "react-icons/fa";
import { useUserRole } from '../context/UserContext';
import { useUnitProvider } from '../context/UnitContext';
import cx from 'clsx';
import classes from './TableReviews.module.css'
import { timeStamp } from 'console';

export interface recentEngagementData {
  unit_type: string;
  role_type: string;
  unit_size: string;
  force_posture: string;
  force_mobility: string;
  force_readiness: string;
  force_skill: string;
  section: number;
}

export interface Tactics {
  ID: string;
  blueScore: number;
  redScore: number;
}

export interface engagementData {
  timeStamp: string;
  engagementID: string;
  friendlyUnitName: string;
  enemyUnitName: string;

}


export default function AAR() {
  const navigate = useNavigate();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const [scrolled, setScrolled] = useState(false);
  // const [isOpen, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

  const handleArrowClick = () => {
    navigate(`/studentPage/${sectionId}`);
  };


const tactics: Tactics[] = [
    { ID: 'Aware of OPFOR?', blueScore: 20, redScore: 0 },
    { ID: 'Within Logistics Support Range?', blueScore: 0, redScore: 25 },
    { ID: 'Within RPA/ISR Coverage?', blueScore: 10, redScore: 0 },
    { ID: 'Working GPS?', blueScore: 10, redScore: 0 },
    { ID: 'Within Fire Support Range?', blueScore: 10, redScore: 0 },
    { ID: 'Within Range of a Pattern Force?', blueScore: 0, redScore: 15 }
  ] 


   const tacticToRow = (tactics: Tactics[]) => (
    tactics.map((tactic) => (
      <Table.Tr key={tactic.ID}>
        <Table.Td>{tactic.ID}</Table.Td>
        <Table.Td>{tactic.blueScore}</Table.Td>
        <Table.Td>{tactic.redScore}</Table.Td>
      </Table.Tr>
    ))
  );

  const engagementData: engagementData[] = [
    { timeStamp: '2024-06-21', engagementID: '1', friendlyUnitName: 'Unit A', enemyUnitName: 'Enemy A' },
    { timeStamp: '2024-06-22', engagementID: '2', friendlyUnitName: 'Unit B', enemyUnitName: 'Enemy B' },
    // Add more objects as needed
  ];

  let index: number = 0;

  const [isOpen, setIsOpen] = useState<boolean[]>(Array(engagementData.length).fill(false));

  const handleToggle = (index: number) => {
    setIsOpen(prev => {
      const newState = [...prev]; // Create a copy of isOpen array
      newState[index] = !newState[index]; // Toggle the state of the clicked row
      return newState;
    });
  };

  const row = engagementData.map((rowData) => (
    <Table.Tr key={rowData.friendlyUnitName}>
      <Table.Td>{rowData.timeStamp}</Table.Td>
      <Table.Td>{rowData.engagementID}</Table.Td>
      <Table.Td>{rowData.friendlyUnitName}</Table.Td>
      <Table.Td>
        <Progress.Root style={{ width: '600px', height: '50px' }}>
          <Progress.Section
            className={classes.progressSection}
            value={30 * .15}
            color="#4e87c1">
          </Progress.Section>
        </Progress.Root>
      </Table.Td>
      <Table.Td>{rowData.enemyUnitName}</Table.Td>
      <Table.Td>
        <Progress.Root style={{ width: '600px', height: '50px' }}>
          <Progress.Section
            className={classes.progressSection}
            value={30 * .15}
            color="#bd3058">
          </Progress.Section>
        </Progress.Root>
      </Table.Td>
    </Table.Tr>
  ));

  const updateProgress = () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollPx / winHeightPx) * 100;
    setProgress(scrolled);
  };

  useEffect(() => {
    window.addEventListener('scroll', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);


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
          <Group h="100%" justify="space-between" px="md" align="center">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
              <Button size='sm' variant='link' onClick={handleArrowClick} style={{ margin: '10px' }}><FaArrowAltCircleLeft /> </Button>
              <Image
                src='https://github.com/mkov77/LEAP/blob/main/Tr_FullColor_NoSlogan.png?raw=true'
                radius="md"
                h={50}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                onClick={handleLogoClick}
                style={{ cursor: 'pointer', scale: '1', padding: '8px' }}
              />
            </div>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <h1 style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>Log of After Action Reviews</h1>
          <h2 style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>Section: {sectionId}</h2>
          <AppShell>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
              <Card shadow="sm" padding="xl" radius="md" withBorder style={{ width: '600px', marginBottom: '200px', marginTop: '200px' }} display={'flex'}>
                <Card.Section >
                  <div style={{ textAlign: 'center' }}>
                    <h2>Most Recent Engagement</h2>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    Engagement ID:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px' }}>
                    <Progress.Root style={{ width: '200px', height: '25px' }}>
                      <Progress.Section
                        className={classes.progressSection}
                        value={30 * .15}
                        color="#4e87c1">
                      </Progress.Section>


                    </Progress.Root>
                    <Progress.Root style={{ width: '200px', height: '25px' }}>
                      <Progress.Section
                        className={classes.progressSection}
                        value={30 * .15}
                        color="#bd3058">
                      </Progress.Section>
                    </Progress.Root>
                  </div>
                  <Table verticalSpacing={'xs'} style={{ width: '600px', justifyContent: 'center' }}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Tactic</Table.Th>
                        <Table.Th>Blue Score</Table.Th>
                        <Table.Th>Red Score</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tacticToRow(tactics)}</Table.Tbody>
                  </Table>
                </Card.Section>
              </Card>
            </div>

            <Table verticalSpacing={'xs'} style={{ width: '100%', tableLayout: 'fixed', justifyContent: 'space-between' }}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Time Stamp</Table.Th>
                  <Table.Th>Engagement ID</Table.Th>
                  <Table.Th>Friendly Unit Name</Table.Th>
                  <Table.Th>Friendly Bar</Table.Th>
                  <Table.Th>Enemy Unit Name</Table.Th>
                  <Table.Th>Enemy Bar</Table.Th>
                </Table.Tr>
              </Table.Thead>
              {engagementData.map((row, index) => (
                <Table.Tbody>
                  <Table.Tr key={index} >
                    <Table.Td>{row.timeStamp}</Table.Td>
                    <Table.Td>{row.engagementID}</Table.Td>
                    <Table.Td>{row.friendlyUnitName}</Table.Td>
                    <Table.Td>
                      <Progress.Root style={{ width: '200px', height: '25px' }}>
                        <Progress.Section
                          className={classes.progressSection}
                          value={40}
                          color="#4e87c1">
                          40%
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>
                    <Table.Td>{row.enemyUnitName}</Table.Td>
                    <Table.Td>
                      <Progress.Root style={{ width: '200px', height: '25px', display: 'flex' }}>
                        <Progress.Section
                          className={classes.progressSection}
                          value={60}
                          color="#bd3058">
                          60%
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>

                    <Table.Td style={{ display: 'flex' }}>
                      <Button className='.toggle-details' size="xs" onClick={() => handleToggle(index)}>
                        {isOpen[index] ? 'Collapse' : 'Expand'}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr style={{ display: 'flex', justifyContent: 'center' }}>
                    <Collapse in={isOpen[index]} style={{ width: '100%' }}>
                      <div style={{ justifyContent: 'center', width: '100%', display: 'flex', marginLeft: '300%' }}>
                        <Table verticalSpacing={'xs'} style={{ maxWidth: '100%', width: '1000px' }} display={'fixed'}>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th style={{ width: '1000px' }}>Tactic</Table.Th>
                              <Table.Th style={{ width: '250px', marginLeft: '100px' }}>Blue Score</Table.Th>
                              <Table.Th style={{ width: '150px', marginLeft: '100px' }}>Red Score</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>{tacticToRow(tactics)}</Table.Tbody>
                        </Table>
                      </div>
                    </Collapse>
                  </Table.Tr>
                </Table.Tbody>
              ))}
            </Table>
          </AppShell>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

