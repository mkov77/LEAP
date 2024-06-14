//afterActionReviewStorage.tsx
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
  ScrollArea,
  Anchor,
  Progress,
  Card,
  Text,
  Collapse,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSun, FaMoon, FaArrowAltCircleLeft} from "react-icons/fa";
import { useUserRole } from '../context/UserContext';
import { useUnitProvider } from '../context/UnitContext';
import cx from 'clsx';
import classes from './TableReviews.module.css'
import { timeStamp } from 'console';


export default function AAR() {
  const navigate = useNavigate();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setOpen] = useState(false);

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

 const handleArrowClick = () => {
    navigate(`/studentPage/${sectionId}`);
  };

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const tactics = [
    {ID:'Aware of OPFOR', blueScore: 20, redScore: 0},
    {ID:'Logisitic Support Range', blueScore: 0, redScore: 25},
    {ID:'Fire Support Range', blueScore: 10, redScore: 0},
    {ID:'GPS', blueScore: 10, redScore: 0},
    {ID:'Communications', blueScore: 10, redScore: 0},
    {ID:'Pattern Force', blueScore: 0, redScore: 15}  
  ]
  const tacticRows = tactics.map((tactic) => (
    <Table.Tr key={tactic.ID}>
      <Table.Td>{tactic.ID}</Table.Td>
      <Table.Td>{tactic.blueScore}</Table.Td>
      <Table.Td>{tactic.redScore}</Table.Td>
    </Table.Tr>
  ));

  const BlueForce = [
    { timeStamp:':00:39', engagmentID:'001', friendlyUnitName:'INF-BRIG-A', enemyUnitName: 'PLA-BRIG-B'},
    { timeStamp:':00:50', engagmentID:'002', friendlyUnitName:'INF-BRIG-A', enemyUnitName: 'PLA-BRIG-B'},
    { timeStamp:':01:39', engagmentID:'002', friendlyUnitName:'INF-BRIG-A', enemyUnitName: 'PLA-BRIG-B'},
    { timeStamp:':03:39', engagmentID:'003', friendlyUnitName:'INF-BRIG-A', enemyUnitName: 'PLA-BRIG-B'},    
    { timeStamp:':07:39', engagmentID:'004', friendlyUnitName:'INF-BRIG-A', enemyUnitName: 'PLA-BRIG-B'},
    { timeStamp:':09:39', engagmentID:'005', friendlyUnitName:'INF-BRIG-A', enemyUnitName: 'PLA-BRIG-B'}
  ];

 const row = BlueForce.map((BlueForce) => (
    <Table.Tr key={BlueForce.friendlyUnitName}>
      <Table.Td>{BlueForce.timeStamp}</Table.Td>
      <Table.Td>{BlueForce.engagmentID}</Table.Td>
      <Table.Td>{BlueForce.friendlyUnitName}</Table.Td>
      <Table.Td><Group justify="space-between">
            {/*}  <Text fz="xs" c="teal" fw={700}>
                {BlueForce.forceSkill.toFixed(0)}%
              </Text>
              <Text fz="xs" c="red" fw={700}>
                {negativeReviews.toFixed(0)}%
              </Text> */}
            </Group>
        <Progress.Root style={{width:'600px', height:'50px'}}>
          <Progress.Section
                className={classes.progressSection}
                value={30 * .15}
                color="#1864ab">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={90 * .02}
                color="#1971c2">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={70 * .25}
                color="#1c7ed6">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={90 * .10}
                color="#228be6">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={50 * .10}
                color="#339af0">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={90 * .04}
                color="#4dabf7">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={70 * .04}
                color="#74c0fc">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={40 * .30}
                color="#a5d8ff">
          </Progress.Section>


        </Progress.Root>
      </Table.Td>
      <Table.Td>{BlueForce.enemyUnitName}</Table.Td>
      <Table.Td>
        <Group justify="space-between">
            {/*}  <Text fz="xs" c="teal" fw={700}>
                {BlueForce.forceSkill.toFixed(0)}%
              </Text>
              <Text fz="xs" c="red" fw={700}>
                {negativeReviews.toFixed(0)}%
              </Text> */}
            </Group>
        <Progress.Root style={{width:'600px', height:'50px'}}>
        <Progress.Section
                className={classes.progressSection}
                value={30 * .15}
                color="#c92a2a">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={90 * .02}
                color="#e03131">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={70 * .25}
                color="#f03e3e">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={50 * .10}
                color="#fa5252">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={30 * .10}
                color="#ff6b6b">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={90 * .04}
                color="#ff8787">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={70 * .04}
                color="#ffa8a8">
          </Progress.Section>
          <Progress.Section
                className={classes.progressSection}
                value={50 * .30}
                color="#ffc9c9">
          </Progress.Section>
        </Progress.Root>
      </Table.Td>
    </Table.Tr>
  ));



  return(
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
                src={null}
                radius="md"
                h={50}
                fallbackSrc="https://placehold.co/600x400?text=Placeholder"
                onClick={handleLogoClick} // Add onClick handler here
                style={{ cursor: 'pointer' }} // Add cursor pointer to indicate clickable
              />
            </div>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
         <h2> This is the AAR Page for {sectionId}</h2>
        <AppShell>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder style={{width: '600px'}}>
            <Card.Section>
              <div style={{textAlign:'center'}}>
                <h2>Most Recent Engagement</h2>
              </div>
              <div style={{textAlign:'center'}}>
                Engagement ID:
              </div>
              <div style={{display:'flex', justifyContent:'space-between', padding: '30px'}}>
              <Progress.Root style={{width:'200px', height:'25px'}}>
                <Progress.Section
                      className={classes.progressSection}
                      value={30 * .15}
                      color="#1864ab">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={90 * .02}
                      color="#1971c2">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={70 * .25}
                      color="#1c7ed6">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={90 * .10}
                      color="#228be6">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={50 * .10}
                      color="#339af0">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={90 * .04}
                      color="#4dabf7">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={70 * .04}
                      color="#74c0fc">
                </Progress.Section>
                <Progress.Section
                      className={classes.progressSection}
                      value={40 * .30}
                      color="#a5d8ff">
                </Progress.Section>


              </Progress.Root>
              <Progress.Root style={{width:'200px', height:'25px'}}>
                <Progress.Section
                        className={classes.progressSection}
                        value={30 * .15}
                        color="#c92a2a">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={90 * .02}
                        color="#e03131">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={70 * .25}
                        color="#f03e3e">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={50 * .10}
                        color="#fa5252">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={30 * .10}
                        color="#ff6b6b">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={90 * .04}
                        color="#ff8787">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={70 * .04}
                        color="#ffa8a8">
                  </Progress.Section>
                  <Progress.Section
                        className={classes.progressSection}
                        value={50 * .30}
                        color="#ffc9c9">
                  </Progress.Section>
                </Progress.Root>
                <Button size="xs" onClick={handleToggle}>
                {isOpen ? 'Collapse' : 'Expand'}
              </Button>
              </div>
              <Table verticalSpacing={'xs'} style={{width: '600px', justifyContent: 'center'}}>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Tactic</Table.Th>
                    <Table.Th>Blue Score</Table.Th>
                    <Table.Th>Red Score</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{tacticRows}</Table.Tbody>
              </Table>
            </Card.Section>
          </Card>
          </div>
        <Table.ScrollContainer minWidth={800}>
         <Table verticalSpacing={'xs'}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Time Stamp</Table.Th>
                <Table.Th>Engagmenet ID</Table.Th>
                <Table.Th>Friendly Unit Name</Table.Th>
                <Table.Th>Friendly Bar</Table.Th>
                <Table.Th>Enemy Unit Name</Table.Th>
                <Table.Th>Enemy Bar</Table.Th>
              </Table.Tr>
            </Table.Thead>
          <Table.Tbody>{row}
            <Table.Tr>
              <Table.Td colSpan={6}></Table.Td>
              <Button size="xs" onClick={handleToggle}>
                {isOpen ? 'Collapse' : 'Expand'}
              </Button>
            </Table.Tr>
          </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Collapse in={isOpen}>
          <div style={{ padding: '10px', borderTop: '1px solid #ccc' }}>
            Additional Details Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
            ut aliquip ex ea commodo consequat.
          </div>
        </Collapse>
      </AppShell>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
} 

