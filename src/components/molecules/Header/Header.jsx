import { useState } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
} from '@mui/material';

import AdminModule from '../../organisms/AdminModule/AdminModule';
import { deepOrange } from '@mui/material/colors';
import { Logout, Settings } from '@mui/icons-material';
import FlexDiv from '../../atoms/FlexDiv';
import { useTranslation } from 'react-i18next';
import { ACCESS_TOKEN } from '../../../constants';
import { getAuth, signOut } from 'firebase/auth';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
`;
const RestyledDiv = styled(StyledDiv)`
  width: 100%;
  max-width: 1280px;
  padding: 0 20px;
  margin: 0 auto;
`;

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [showUsers, setShowUsers] = useState(false);

  const {
    i18n: { changeLanguage, language },
  } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(language);

  const handleChangeLanguage = ({ target }) => {
    const newLanguage = target?.value;
    setCurrentLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (item) => {
    setAnchorEl(null);
    setShowUsers(false);
    if (item === 'users') {
      setShowUsers(true);
    } else if (item === 'logout') {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log('logoff successful');
          sessionStorage.removeItem(ACCESS_TOKEN);
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (item === 'theme') {
      console.log('Theme clicked');
      document.body.classList.toggle('billVariant');
    }
  };

  return (
    <StyledDiv>
      <RestyledDiv>
        <h1 className="text-5xl font-bold">Bill Share</h1>

        <FlexDiv align={'center'} margin={'20px 0'}>
          <FormControl size="small1" sx={{ mr: '20px', minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currentLanguage}
              label="Language"
              onChange={handleChangeLanguage}
            >
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'es'}>Español</MenuItem>
              <MenuItem value={'te'}>తెలుగు</MenuItem>
              <MenuItem value={'hi'}>हिंदी</MenuItem>
            </Select>
          </FormControl>
          <IconButton aria-label="settings" size="small" onClick={handleClick}>
            <Avatar sx={{ bgcolor: deepOrange[500], width: 52, height: 52 }}>
              S
            </Avatar>
          </IconButton>
        </FlexDiv>
      </RestyledDiv>
      {showUsers && <AdminModule open={showUsers} handleClose={handleClose} />}

      <Menu
        dense="true"
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleClose('theme')}>
          <ListItemIcon>
            <Avatar sx={{ width: 24, height: 24 }} />
          </ListItemIcon>
          Theme
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
