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
  MantineProvider,
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

import classes from './TableReviews.module.css'
import { timeStamp } from 'console';
import BattlePage from './battlePage';
import axios from 'axios';

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
  question: string;
  //engagementid: string;
  friendlytacticsscore: number;
  enemytacticsscore: number;
}

// export interface engagementData {
//   timeStamp: string;
//   engagementID: string;
//   friendlyUnitName: string;
//   enemyUnitName: string;

// }

export interface Engagement {
  friendlyid: string;
  enemyid: string;
  engagementid: string;
  friendlybasescore: string;
  enemybasescore: string;
  friendlytacticsscore: string;
  enemytacticsscore: string;
  friendlytotalscore: number;
  enemytotalscore: number;
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
 // const [engagementsData, setEngagementsData] = useState<engagementData[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);


  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

  const handleArrowClick = () => {
    navigate(`/studentPage/${sectionId}`);
  };

  
  useEffect(() => {
    const fetchEngagementData = async () => {
      try {
        console.log('Fetching data for engagement:', sectionId);
        const response = await axios.get<Engagement[]>(`http://10.0.1.226:5000/api/engagements/${sectionId}`, {
          params: {
            sectionid: sectionId  // Pass userSection as a query parameter
          }
        });
        setEngagements(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchEngagementData();
  }, [sectionId]);


  const tactics: Tactics[] = [
    { question: 'Aware of OPFOR?', friendlytacticsscore: 20, enemytacticsscore: 0 },
    { question: 'Within Logistics Support Range?', friendlytacticsscore: 0, enemytacticsscore: 25 },
    { question: 'Within RPA/ISR Coverage?', friendlytacticsscore: 10, enemytacticsscore: 0 },
    { question: 'Working GPS?', friendlytacticsscore: 10, enemytacticsscore: 0 },
    { question: 'Within Fire Support Range?', friendlytacticsscore: 10, enemytacticsscore: 0 },
    { question: 'Within Range of a Pattern Force?', friendlytacticsscore: 0, enemytacticsscore: 15 }
  ]


  const tacticToRow = (tactics: Tactics[]) => (
    tactics.map((tactic) => (
      <Table.Tr key={tactic.question}>
        <Table.Td>{tactic.question}</Table.Td>
        <Table.Td>{tactic.friendlytacticsscore}</Table.Td>
        <Table.Td>{tactic.enemytacticsscore}</Table.Td>
      </Table.Tr>
    ))
  );

  // const engagementData: engagementData[] = [
  //   { timeStamp: '2024-06-21', engagementID: '1', friendlyUnitName: 'Unit A', enemyUnitName: 'Enemy A' },
  //   { timeStamp: '2024-06-22', engagementID: '2', friendlyUnitName: 'Unit B', enemyUnitName: 'Enemy B' },
  //   // Add more objects as needed
  // ];

  

  let index: number = 0;

  const [isOpen, setIsOpen] = useState<boolean[]>(Array(engagements.length).fill(false));

  const handleToggle = (index: number) => {
    setIsOpen(prev => {
      const newState = [...prev]; // Create a copy of isOpen array
      newState[index] = !newState[index]; // Toggle the state of the clicked row
      return newState;
    });
  };

  const row = engagements.map((rowData) => (
    <Table.Tr key={rowData.engagementid}>
      <Table.Td>{rowData.friendlyid}</Table.Td>
      <Table.Td>{rowData.engagementid}</Table.Td>
      <Table.Td>{rowData.friendlyid}</Table.Td>
      <Table.Td>
        <Progress.Root style={{ width: '600px', height: '50px' }}>
          <Progress.Section
            className={classes.progressSection}
            value={30 * .15}
            color="#4e87c1">
          </Progress.Section>
        </Progress.Root>
      </Table.Td>
      <Table.Td>{rowData.enemyid}</Table.Td>
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
                  {/* <div style={{ textAlign: 'center' }}>
                    Engagement engagementid:
                  </div> */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '30px' }}>
                    <Progress.Root style={{ width: '200px', height: '25px' }}>
                      <Progress.Section
                        className={classes.progressSection}
                        value={30}
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
                        <Table.Th>Friendly Score</Table.Th>
                        <Table.Th>Enemy Score</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{tacticToRow(tactics)}</Table.Tbody>
                  </Table>
                </Card.Section>
              </Card>
            </div>

            {/* {engagements.map((engagement, index) => (
            <li key={index}>
              <strong>Engagement engagementid:</strong> {engagement.engagementid}, 
              <strong> Timestamp:</strong> {engagement.friendlyid}, 
              <strong> Friendly Unit:</strong> {engagement.enemyid}, 
            </li>
          ))} */}

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
              {engagements.map((row, index) => (
                <Table.Tbody>
                  <Table.Tr key={index} >
                    <Table.Td>{row.engagementid}</Table.Td>
                    <Table.Td>{row.engagementid}</Table.Td>
                    <Table.Td>{row.friendlyid}</Table.Td>
                    <Table.Td>
                      <Progress.Root style={{ width: '200px', height: '25px' }}>
                        <Progress.Section
                          className={classes.progressSection}
                          value={row.friendlytotalscore}
                          color="#4e87c1">
                          {Number(row.friendlytotalscore).toFixed(0)}%
                        </Progress.Section>
                      </Progress.Root>
                    </Table.Td>
                    <Table.Td>{row.enemyid}</Table.Td>
                    <Table.Td>
                      <Progress.Root style={{ width: '200px', height: '25px', display: 'flex' }}>
                        <Progress.Section
                          className={classes.progressSection}
                          value={row.enemytotalscore}
                          color="#bd3058">
                          {Number(row.enemytotalscore).toFixed(0)}%
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
                              <Table.Th style={{ width: '250px', marginLeft: '100px' }}>Friendly Score</Table.Th>
                              <Table.Th style={{ width: '150px', marginLeft: '100px' }}>Enemy Score</Table.Th>
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

function setEngagementOnline(isonline: any) {
  throw new Error('Function not implemented.');
}

