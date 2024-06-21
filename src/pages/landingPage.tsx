import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Box, useMantineTheme, FocusTrap, Image, Paper, PasswordInput, Button, Title, SegmentedControl } from '@mantine/core'; // Adjust imports as needed
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './landingPage.module.css';
import { useUserRole } from '../context/UserContext';
import { MantineProvider } from '@mantine/core';

export interface Section {
  sectionid: string;
  isonline: boolean;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const [force, setForce] = useState('JFLCC');
  const theme = useMantineTheme();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { setUserRole, setUserSection } = useUserRole();
  const form = useForm({
    initialValues: { password: '' },
    validate: {
      password: (value: string) =>
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

  const renderSectionsTable = () => (
    <Box style={{ maxWidth: 600, margin: '0 auto'}}>
        <h1 className='sessionCentered' >
             Select Student Session
        </h1>
        <Table withRowBorders>
          <Table.Thead>
            <Table.Tr>
              <th className='left-oriented'>Section ID</th>
              <th className='isonlineCentered'>Is Online</th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sections.map((section) => (
              <Table.Tr
                key={section.sectionid}
                onClick={() => {
                  if (section.isonline) {
                    if(selectedSection === section.sectionid){
                      handleLogin(form.values);
                    }
                    setSelectedSection((prev) =>
                      prev === section.sectionid ? null : section.sectionid
                    );
                  }
                }}
                style={{
                  cursor: section.isonline ? 'pointer' : 'not-allowed',
                  backgroundColor: selectedSection === section.sectionid ? 'rgba(128, 128, 128, 0.5)' : '',
                  textAlign: 'center',
                }}
                className="highlightable-row"
              >
                <Table.Td>{section.sectionid}</Table.Td>
                <Table.Td>
                  <Box
                    style={{
                      backgroundColor: section.isonline ? theme.colors.green[0] : theme.colors.red[0],
                      color: section.isonline ? theme.colors.green[9] : theme.colors.red[9],
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'block',                    
                    }}
                    className = "isonlineCentered"
                  >
                    {section.isonline ? 'Online' : 'Offline'}
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
          {(role === 'Student') && (
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
