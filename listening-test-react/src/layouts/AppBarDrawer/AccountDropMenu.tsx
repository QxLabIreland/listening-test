import React, {useContext} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Button, Icon, ListItemIcon, ListItemText} from "@material-ui/core";
import {CurrentUser} from "../../shared/ReactContexts";
import {Link} from "react-router-dom";
import Axios from "axios";


export function AccountDropMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const {currentUser} = useContext(CurrentUser);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = () => {
    Axios.delete('/api/login').then();
    handleClose();
  }

  return <>
    <Button color="inherit" onClick={handleClick} style={{textTransform: 'none'}}>
      <Icon style={{marginRight: 8}}>account_circle</Icon> {currentUser.name}
    </Button>
    <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={handleClose}>
      <MenuItem onClick={handleClose} component={Link} to={`/user/settings`}>
        <ListItemIcon>
          <Icon fontSize="small">settings</Icon>
        </ListItemIcon>
        <ListItemText primary="Settings"/>
      </MenuItem>
      <MenuItem onClick={handleClose} component={Link} to={`/user/storage-allocation`}>
        <ListItemIcon>
          <Icon fontSize="small">data_usage</Icon>
        </ListItemIcon>
        <ListItemText primary="Storage Usage"/>
      </MenuItem>
      <MenuItem onClick={handleSignOut} component={Link} to="/sign-in">
        <ListItemIcon>
          <Icon fontSize="small">exit_to_app</Icon>
        </ListItemIcon>
        <ListItemText primary="Sign out"/>
      </MenuItem>
    </Menu>
  </>;
}
