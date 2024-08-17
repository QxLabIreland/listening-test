import { observer } from 'mobx-react';
import React from 'react';

import { Alert, Icon, IconButton, Snackbar, Stack } from '@mui/material';

import { globalStore } from './globalStore';

export default observer(function GlobalSnackbarProvider() {
  const handleClose = (index: number, _?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    globalStore.closeSnakeBar(index);
  };

  return (
    <Stack spacing={2} position="fixed" bottom={2} left={2} zIndex={5500}>
      {globalStore.snackbarList.map((option, index) =>
        option.severity ? (
          <Snackbar
            key={option.id}
            sx={{ position: 'relative' }}
            open={option.isOpen}
            autoHideDuration={option.time}
            onClose={(evt, reason) => handleClose(index, evt, reason)}
            TransitionProps={{ onExited: () => globalStore.removeSnakeBar(index) }}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => handleClose(index)}>
                <Icon fontSize="small">cancel</Icon>
              </IconButton>
            }>
            <Alert onClose={() => handleClose(index)} severity={option.severity} variant="filled" elevation={6}>
              {option.message}
            </Alert>
          </Snackbar>
        ) : (
          <Snackbar
            key={option.id}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={option.isOpen}
            autoHideDuration={option.time}
            message={option.message}
            onClose={(evt, reason) => handleClose(index, evt, reason)}
            TransitionProps={{ onExited: () => globalStore.removeSnakeBar(index) }}
            action={
              <IconButton size="small" aria-label="close" color="inherit" onClick={() => handleClose(index)}>
                <Icon fontSize="small">cancel</Icon>
              </IconButton>
            }
          />
        ),
      )}
    </Stack>
  );
});
