import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { globalStore } from '../../global/globalStore';
import { URL_TO_TITLE } from '../../shared/enums/test-urls';
import { AccountDropMenu } from './AccountDropMenu';
import { NotificationDrawer } from './NotificationDrawer';

export const DRAWER_WIDTH = 240;

export default observer(function AppBarLayout(props: PropsWithChildren<{ handleDrawerToggle: any }>) {
  const { handleDrawerToggle } = props;
  const navigate = useNavigate();

  const routeSegments = useLocation().pathname.split('/');
  const listPageTitle = routeSegments.length === 3 ? URL_TO_TITLE[routeSegments[2]] : null;

  return (
    <>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
        }}>
        <Toolbar>
          {listPageTitle ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}>
              <Icon>menu</Icon>
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => navigate(routeSegments[2])}>
              <Icon>arrow_back</Icon>
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            {listPageTitle ?? globalStore.appBarTitle}
          </Typography>
          <Box flexGrow={1} />
          <AccountDropMenu />
          <NotificationDrawer />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={theme => ({
          flexGrow: 1,
          padding: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: theme.palette.background.default,
        })}>
        <Toolbar />
        <Container maxWidth="md">{props.children}</Container>
      </Box>
    </>
  );
});
