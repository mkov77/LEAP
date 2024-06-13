import React, { useState, useEffect, useRef } from 'react';
import { Image, Paper, PasswordInput, Button, Title, SegmentedControl, Table, Box, useMantineTheme, Text, useMantineColorScheme, useComputedColorScheme, FocusTrap } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './landingPage.module.css';
import { sections } from '../data/sections';
import './landingPage.module.css';
import { useUserRole } from '../context/UserContext';
import { MantineProvider } from '@mantine/core';
import Hierarchy from '../components/HierarchyBuilder';


export interface Section {
  sectionID: string;
  isOnline: boolean;
}


export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const [force, setForce] = useState('JFLCC');
  const theme = useMantineTheme();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { userRole, setUserRole, userSection, setUserSection } = useUserRole();

  const form = useForm({
    initialValues: { password: '' },
    validate: {
      password: (value) =>
        role === 'Administrator' && value !== 'admin' ? 'Incorrect admin password' : null,
    },
  });

  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trapRef.current) {
      trapRef.current.focus();
    }
  }, []);

  // Function to handle login based on role and selected section
  const handleLogin = (values: { password: string }) => {
    if (role === 'Administrator' && values.password === 'admin') {
      setUserRole(role);
      navigate('/admin');
    } else if (role === 'Student' || role === 'Observer') {
      if (role === 'Student') {
        setUserRole(role);
        setUserSection(selectedSection);
        navigate(`/studentPage/${selectedSection}`); // Navigate to student page
      } else if (role === 'Observer' && selectedSection) {
        setUserRole(role);
        setUserSection(selectedSection);
        navigate(`/observerPage/${selectedSection}`); // Navigate to observer page with selected section
      }
    }
  };

  // Function to render the sections table
  const renderSectionsTable = () => (
    <Box style={{ maxWidth: 600, margin: '0 auto'}}>
        <h1 className='sessionCentered' >
             Select Student Session
        </h1>
        <Table withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <th className='left-oriented'>Section ID</th>
              <th className='isOnlineCentered'>Is Online</th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sections.map((section) => (
              <Table.Tr
                key={section.sectionID}
                onClick={() => {
                  if (section.isOnline) {
                    if(selectedSection === section.sectionID){
                      //If the clicked row is already selected, navigate accordingly
                      handleLogin(form.values);
                    }
                    setSelectedSection((prev) =>
                      prev === section.sectionID ? null : section.sectionID
                    );
                  }
                }}
                style={{
                  cursor: section.isOnline ? 'pointer' : 'not-allowed',
                  backgroundColor: selectedSection === section.sectionID ? 'rgba(128, 128, 128, 0.5)' : '',
                  textAlign: 'center',
                }}
                className="highlightable-row"
              >
                <Table.Td>{section.sectionID}</Table.Td>
                <Table.Td>
                  <Box
                    style={{
                      backgroundColor: section.isOnline ? theme.colors.green[0] : theme.colors.red[0],
                      color: section.isOnline ? theme.colors.green[9] : theme.colors.red[9],
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'block',                    
                    }}
                    className = "isOnlineCentered"
                  >
                    {section.isOnline ? 'Online' : 'Offline'}
                  </Box>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
    </Box>
  );

  return (
    <MantineProvider defaultColorScheme='dark'>
      <div className={classes.wrapper}>
        <Paper className={classes.form} radius={0} p={30}>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px', scale:'0.75' }}>
            <Image
              radius="md"
              src="https://github.com/mkov77/LEAP/blob/main/Tr_FullColor.png?raw=true"
              h={200}
              fallbackSrc='https://placehold.co/600x400?text=Placeholder'
            />
          </div>
          <div style={{ margin: '10px'}} >
            <SegmentedControl
              size="lg"
              data={['Student', 'Observer', 'Administrator']}
              value={role}
              onChange={setRole}
            />
          </div>
          {(role === 'Observer' || role === 'Student') && (
            <div style={{ margin: '10px'}} >
              <SegmentedControl
                size="lg"
                data={['JFLCC', 'JFSOCC']}
                value={force}
                onChange={setForce}
              />
            </div>
          )}
          {role === 'Administrator' && (
          <FocusTrap>
            <div ref={trapRef} tabIndex={-1}>
              <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
                <center>
                <PasswordInput
                  label="Password"
                  placeholder="Admin password"
                  mt="md"
                  size="md"
                  style={{justifyContent: 'center', width: '250px', alignItems: 'center'}}
                  {...form.getInputProps('password')}
                />
        
                <div style={{ margin: '10px', width: '250px', justifyContent: "center", textAlign: "center", alignItems: 'center'}} >
                  <Button 
                    fullWidth
                    mt="xl"
                    size="md"
                    type="submit"
                    disabled={!form.values.password}
                  >
                    Login
                  </Button>
                </div>
                </center>
              </form>
            </div>
          </FocusTrap>
          )}
          {(role === 'Student' || role === 'Observer') && renderSectionsTable()}
          {(role === 'Student' || role === 'Observer') && (
            <div style={{display: "flex", justifyContent: "center", textAlign: "center"}}>
              <Button
                style={{height: '30px', width: '250px',textAlign: "center"}}
                mt="xl"
                size="md"
                onClick={() => handleLogin(form.values)} // Update route
                disabled={!selectedSection}
              >
                {/* button text based on role */}
                {role === 'Student' ? 'Launch Session' : 'Launch Observer Session'}
              </Button>
            </div>
            
          )}

        </Paper>
      </div>
    </MantineProvider>
  );
}
