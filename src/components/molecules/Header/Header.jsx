import { useState } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from '@mui/material';

import AdminModule from '../../organisms/AdminModule/AdminModule';
import { deepOrange } from '@mui/material/colors';
import { Logout, Settings } from '@mui/icons-material';

const StyledDiv = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
`;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showUsers, setShowUsers] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item) => {
    setAnchorEl(null);
    setShowUsers(false);
    if (item === 'users') setShowUsers(true);
  };

  return (
    <StyledDiv>
      <h1>Bill Share</h1>

      <IconButton aria-label="settings" size="small" onClick={handleClick}>
        <Avatar sx={{ bgcolor: deepOrange[500], width: 52, height: 52 }}>
          S
        </Avatar>
      </IconButton>

      {showUsers && <AdminModule open={showUsers} handleClose={handleClose} />}

      <Menu
        dense
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose()}>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          Profile
        </MenuItem>

        <MenuItem onClick={() => handleClose('users')}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          Group members
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleClose('logout')}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </StyledDiv>
  );
};

export default Header;
