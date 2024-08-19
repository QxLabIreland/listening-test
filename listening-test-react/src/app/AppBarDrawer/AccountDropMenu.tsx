import Axios from 'axios';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AccountCircle } from '@mui/icons-material';
import { Button, Icon, IconButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { CurrentUser } from '../../shared/ReactContexts';

export default function AccountDropMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { currentUser } = useContext(CurrentUser);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    Axios.delete('/api/login').then();
    handleClose();
  };

  return (
    <>
      <Button
        sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        color="inherit"
        onClick={handleClick}
        style={{ textTransform: 'none' }}>
        <AccountCircle sx={{ mr: 1 }} />
        <Typography>{currentUser.name}</Typography>
      </Button>
      <IconButton sx={{ display: { xs: 'inline-flex', sm: 'none' } }} color="inherit" onClick={handleClick}>
        <AccountCircle />
      </IconButton>

      <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
        <MenuItem sx={{ display: { xs: 'flex', sm: 'none' } }}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={currentUser.name} />
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to={`/user/settings`}>
          <ListItemIcon>
            <Icon fontSize="small">settings</Icon>
          </ListItemIcon>
          <ListItemText primary="Settings and Usage" />
        </MenuItem>
        <MenuItem onClick={handleSignOut} component={Link} to="/sign-in">
          <ListItemIcon>
            <Icon fontSize="small">exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>
    </>
  );
}
