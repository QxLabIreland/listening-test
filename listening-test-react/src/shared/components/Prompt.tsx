import React from 'react';
import { useBlocker } from 'react-router-dom';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function Prompt({ when }: { when: boolean }) {
  // Block navigating elsewhere when data has been entered into the input
  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) => when && currentLocation.pathname !== nextLocation.pathname,
  );

  return (
    <Dialog
      open={blocker.state === 'blocked'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Unsaved Changes</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You have unsaved changes, are you sure leaving this page?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => blocker.reset()}>Cancel</Button>
        <Button onClick={() => blocker.proceed()} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
