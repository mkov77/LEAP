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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSun, FaMoon, FaArrowAltCircleLeft} from "react-icons/fa";
import { useUserRole } from '../context/UserContext';
import { useUnitProvider } from '../context/UnitContext';

export default function AAR() {
  const navigate = useNavigate();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(false);
  const [search, setSearch] = useState("");
  const { sectionId } = useParams(); // Retrieve sectionId from route parameters
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();
  const { selectedUnit, setSelectedUnit } = useUnitProvider();

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the main login page
  };

 {/* const handleArrowClick = () => {
    navigate('/studentPage/${sectionId}');
  }; */}

 {/*const table = useMantineReactTable({
    columns,
    data,
    enableRowSelection: true,
  }); */}

  const BlueForce = [
    { name:'INF-BRIG-A', unitType:'Infantry', roleType:'Combat', unitSize:'Brigade', forcePosture:'Offensive', forceMobility:'Mobile (foot)', forceReadiness:'Elite', forceSkill:'Advanced'},
    { name:'INF-BRIG-A', unitType:'Infantry', roleType:'Combat', unitSize:'Brigade', forcePosture:'Offensive', forceMobility:'Mobile (foot)', forceReadiness:'Elite', forceSkill:'Advanced'},
    { name:'INF-BRIG-A', unitType:'Infantry', roleType:'Combat', unitSize:'Brigade', forcePosture:'Offensive', forceMobility:'Mobile (foot)', forceReadiness:'Elite', forceSkill:'Advanced'},
    { name:'INF-BRIG-A', unitType:'Infantry', roleType:'Combat', unitSize:'Brigade', forcePosture:'Offensive', forceMobility:'Mobile (foot)', forceReadiness:'Elite', forceSkill:'Advanced'},
    { name:'INF-BRIG-A', unitType:'Infantry', roleType:'Combat', unitSize:'Brigade', forcePosture:'Offensive', forceMobility:'Mobile (foot)', forceReadiness:'Elite', forceSkill:'Advanced'},
  ];

 {/*} const row = BlueForce.map((BlueForce) => (
    <Table.Tr key={BlueForce.name}>
      <Table.Td>{BlueForce.name}</Table.Td>
      <Table.Td>{BlueForce.unitType}</Table.Td>
      <Table.Td>{BlueForce.roleType}</Table.Td>
      <Table.Td>{BlueForce.unitSize}</Table.Td>
      <Table.Td>{BlueForce.forcePosture}</Table.Td>
      <Table.Td>{BlueForce.forceMobility}</Table.Td>
      <Table.Td>{BlueForce.forceReadiness}</Table.Td>
      <Table.Td>{BlueForce.forceSkill}</Table.Td>
    </Table.Tr>
  )); */}

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
              {/*<Button size='sm' variant='link' onClick={handleArrowClick} style={{ margin: '10px' }}><FaArrowAltCircleLeft /> </Button> */}
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
         
        {/* <MantineReactTable table={table} /> */}
         <Table stickyHeader stickyHeaderOffset={60}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Unit Name</Table.Th>
                <Table.Th>Unit Type</Table.Th>
                <Table.Th>Role Type</Table.Th>
                <Table.Th>Unit Size</Table.Th>
                <Table.Th>Force Posture</Table.Th>
                <Table.Th>Force Mobility</Table.Th>
                <Table.Th>Force Readiness</Table.Th>
                <Table.Th>Force Skill</Table.Th>
              </Table.Tr>
            </Table.Thead>
          {/*}  <Table.Tbody>{row}</Table.Tbody> */}
          </Table>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
} 

