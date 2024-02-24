import { useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminModule from '../../organisms/AdminModule/AdminModule';

import '../../../App.css';

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
`;

const Header = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <StyledDiv>
      <h1>Bill Share</h1>

      <IconButton aria-label="settings" size="large" onClick={handleOpen}>
        <SettingsIcon fontSize="inherit" />
      </IconButton>

      {open && <AdminModule open={open} handleClose={handleClose} />}
    </StyledDiv>
  );
};

export default Header;
