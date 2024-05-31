import React, { useState } from 'react';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Grid, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";

const SessionLauncher = () => {
  const [role, setRole] = useState('');
  const [section, setSection] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);

  const navigate = useNavigate()

  const gotToNewPage = () => {
    if (role === 'student' || role === 'instructor') {
      navigate(`/session/${section}`);
    } else if (role === 'admin' && password === 'admin') {
      // Admin-specific navigation logic if required
      navigate("/StudentSession");
    }
    else{
        navigate("/StudentSession");
    }
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    // Reset selected sections when role changes
    setSelectedSections([]);
    setSection('');
  };

  const handleSectionChange = (e) => {
    setSection(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLaunchSession = () => {
    if (role === 'admin' && password === 'admin') {
      console.log('Launching session as admin...');
      // Implement launching session logic here for admin
    } else if (section) {
      console.log(`Launching session as ${role} with section ${section}`);
      // Implement launching session logic here for student or instructor
    } else {
      console.log('Please select a section.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" gutterBottom>
        Session Launcher
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="role-label">Select Role</InputLabel>
        <Select
          labelId="role-label"
          id="role"
          value={role}
          onChange={handleRoleChange}
          label="Select Role"
        >
          <MenuItem value="">Select Role</MenuItem>
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="observer">Instructor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>
      {role && (role === 'student' || role === 'instructor') && (
        <FormControl fullWidth>
          <InputLabel id="section-label">Select Section</InputLabel>
          <Select
            labelId="section-label"
            id="section"
            value={section}
            onChange={handleSectionChange}
            label="Select Section"
          >
            <MenuItem value="">Select Section</MenuItem>
            <MenuItem value="M1">M1</MenuItem>
            <MenuItem value="M3">M3</MenuItem>
            <MenuItem value="M4">M4</MenuItem>
            <MenuItem value="M5">M5</MenuItem>
          </Select>
        </FormControl>
      )}
      {role === 'admin' && (
        <TextField
          fullWidth
          id="password"
          label="Admin Password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          margin="normal"
        />
      )}
      <Button
        onClick={() => gotToNewPage()}
        variant="contained"
        color="primary"
        fullWidth
        disabled={(role === 'admin' && password !== 'admin') || (!section && role !== 'admin')}
      >
        Launch Session
      </Button>
    </Container>
  );
};

export default SessionLauncher;
