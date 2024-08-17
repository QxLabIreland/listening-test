import React, { PropsWithChildren, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Container } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { AppBarTitle } from '../../shared/ReactContexts';
import { AccountDropMenu } from './AccountDropMenu';
import { NotificationDrawer } from './NotificationDrawer';
import { URL_TO_TITLE } from '../../shared/enums/test-urls';

export const DRAWER_WIDTH = 240;

export default function AppBarLayout(props: PropsWithChildren<{ handleDrawerToggle: any }>) {
  const { handleDrawerToggle } = props;
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>();

  const routeSegments = useLocation().pathname.split('/');
  const listPageTitle = routeSegments.length === 3 ? URL_TO_TITLE[routeSegments[2]] : null;

  return (
    <AppBarTitle.Provider value={{ title: title, setTitle: (title) => setTitle(title) }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}>
        <Toolbar>
          {listPageTitle ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}>
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
            {listPageTitle ?? title}
          </Typography>
          <Box flexGrow={1} />
          <AccountDropMenu />
          <NotificationDrawer />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          padding: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: theme.palette.background.default,
        })}>
        <Toolbar />
        <Container maxWidth="md">{props.children}</Container>
      </Box>
    </AppBarTitle.Provider>
  );
}
