// src/components/AppBar.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#282c34', // Match the header background color from App.css
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  textAlign: 'center',
  color: '#fffff', // Match the link color from App.css
}));

const MyAppBar = () => {
  return (
    <StyledAppBar position="static">
      <Toolbar>
        <StyledTypography variant="h6">
          LEAP
        </StyledTypography>
      </Toolbar>
    </StyledAppBar>
  );
};

export default MyAppBar;
