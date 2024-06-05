import React, { useState } from 'react';
import { Paper, PasswordInput, Button, Title, SegmentedControl, Table, Box, useMantineTheme, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import classes from './landingPage.module.css';
import { sections } from '../data/sections';

export interface Section {
  sectionID: string;
  isOnline: boolean;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const theme = useMantineTheme();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const form = useForm({
    initialValues: { password: '' },
    validate: {
      password: (value) =>
        role === 'Admin' && value !== 'admin' ? 'Incorrect admin password' : null,
    },
  });

  const handleLogin = (values: { password: string }) => {
    if (role === 'Admin' && values.password === 'admin') {
      navigate('/admin');
    } else if (role === 'Student' || role === 'Observer') {
      if (role === 'Student') {
        navigate(`/studentPage/${selectedSection}`); // Navigate to student page
      } else if (role === 'Observer' && selectedSection) {
        navigate(`/observerPage/${selectedSection}`); // Navigate to observer page with selected section
      }
    }
  };

  const renderSectionsTable = () => (
    <Box style={{ maxWidth: 600, margin: '0 auto' }}>
      <Table>
        <thead>
          <tr>
            <th>Section ID</th>
            <th>Is Online</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <tr
              key={section.sectionID}
              onClick={() => {
                if (section.isOnline) {
                  setSelectedSection((prev) =>
                    prev === section.sectionID ? null : section.sectionID
                  );
                }
              }}
              style={{
                cursor: section.isOnline ? 'pointer' : 'not-allowed',
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
            </tr>
          ))}
        </tbody>
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
          <Button
          fullWidth
          mt="xl"
          size="md"
          onClick={() => handleLogin(form.values)} // Update route
          disabled={!selectedSection}
        >
          Login
        </Button>
        
        )}
      </Paper>
    </div>
  );
}
