import React, { useState } from 'react';
import { Paper, PasswordInput, Button, Title, SegmentedControl, Table, Box, useMantineTheme, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './landingPage.module.css';
import { sections } from '../data/sections';
import './landingPage.module.css';
import { useUserRole } from '../context/UserContext';

export interface Section {
  sectionID: string;
  isOnline: boolean;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const theme = useMantineTheme();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { userRole, setUserRole } = useUserRole();



  const form = useForm({
    initialValues: { password: '' },
    validate: {
      password: (value) =>
        role === 'Admin' && value !== 'admin' ? 'Incorrect admin password' : null,
    },
  });

  // Function to handle login based on role and selected section
  const handleLogin = (values: { password: string }) => {
    if (role === 'Admin' && values.password === 'admin') {
      setUserRole(role);
      navigate('/admin');
    } else if (role === 'Student' || role === 'Observer') {
      if (role === 'Student') {
        setUserRole(role);
        navigate(`/studentPage/${selectedSection}`); // Navigate to student page
      } else if (role === 'Observer' && selectedSection) {
        setUserRole(role);
        navigate(`/observerPage/${selectedSection}`); // Navigate to observer page with selected section
      }
    }
  };

  // Function to render the sections table
  const renderSectionsTable = () => (
    <Box style={{ maxWidth: 600, margin: '0 auto'}}>
        <h1 className='sessionCentered' >
             Ensure Correct Student Session is Selected
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
                  backgroundColor: selectedSection === section.sectionID ? theme.colors.gray[0] : '',
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
    <div className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title order={2} className={classes.title} ta="center" mt="md" mb={50}>
          Welcome back to LEAP
        </Title>
        <SegmentedControl
          size="lg"
          data={['Student', 'Observer', 'Admin']}
          value={role}
          onChange={setRole}
        />
        {role === 'Admin' && (
          <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
            <PasswordInput
              label="Password"
              placeholder="Admin password"
              mt="md"
              size="md"
              {...form.getInputProps('password')}
            />
            {form.errors.password && (
              <Text color="red" size="sm" mt="sm">
                {form.errors.password}
              </Text>
            )}
            <Button
              fullWidth
              mt="xl"
              size="md"
              type="submit"
              disabled={!form.values.password}
            >
              Login
            </Button>
          </form>
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
  );
}