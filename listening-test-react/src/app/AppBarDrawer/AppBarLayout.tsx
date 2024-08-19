import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Container, Tab, Tabs } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { globalStore } from '../../global/globalStore';
import { RESPONSE_HASH_URL, TEST_URLS, TestUrl } from '../../shared/enums/test-urls';
import AccountDropMenu from './AccountDropMenu';
import NotificationDrawer from './NotificationDrawer';
import ScrollTop from './ScrollTop';

export const DRAWER_WIDTH = 240;

export default observer(function AppBarLayout(props: PropsWithChildren<{ handleDrawerToggle: () => void }>) {
  const { handleDrawerToggle } = props;
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const routeSegments = location.pathname.split('/');

  const isResponsePage = location.hash === RESPONSE_HASH_URL;
  const isTestDetailPage = routeSegments.length === 4 && TEST_URLS.includes(routeSegments[2] as TestUrl);
  const handleTabChange = () => {
    navigate({ hash: isResponsePage ? null : RESPONSE_HASH_URL });
  };

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
          {isTestDetailPage ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => navigate(routeSegments[2])}>
              <Icon>arrow_back</Icon>
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}>
              <Icon>menu</Icon>
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ mr: 4 }}>
            {globalStore.appBarTitle}
          </Typography>

          {isTestDetailPage && (
            <Tabs
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="inherit"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: 'white',
                },
              }}
              value={isResponsePage ? 1 : 0}
              onChange={handleTabChange}>
              <Tab label="Questions" />
              <Tab label="Responses" disabled={id === '0'} />
            </Tabs>
          )}

          <Box flexGrow={1} />
          <AccountDropMenu />
          <NotificationDrawer />
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={theme => ({
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          backgroundColor: theme.palette.background.default,
        })}>
        <Toolbar id="back-to-top-anchor" />
        <Container maxWidth="md" sx={{ padding: 2 }}>
          {props.children}
        </Container>
        <ScrollTop />
      </Box>
    </>
  );
});
