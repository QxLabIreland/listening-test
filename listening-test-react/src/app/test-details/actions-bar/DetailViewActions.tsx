import { observer } from 'mobx-react';
import React from 'react';

import { Checkbox, FormControlLabel, Icon, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';

import { TestUrl } from '../../../shared/enums/test-urls';
import { ShareLinkDialog } from '../../test-list/ShareLinkDialog';
import { ResponsePreviewDialog } from '../../test-responses/ResponsePreviewDialog';
import { testDetails } from '../test-details-store';
import TestSettingsDialog from './TestSettingsDialog';

export default observer(function DetailViewActions(props: { testUrl: TestUrl; handleSubmit: () => void }) {
  const { testUrl, handleSubmit } = props;
  // Share Dialog state
  const shareDialogState = React.useState(false);

  return (
    <Grid
      item
      xs={12}
      container
      alignItems="center"
      spacing={1}
      // sx={{ position: 'sticky', top: 60, backgroundColor: 'white', zIndex: 20 }}
    >
      <Grid item style={{ flexGrow: 1 }} />
      <Grid item>
        <Tooltip title="If you don't wanna receive more responses, you can check this option">
          <FormControlLabel
            label="Stop receiving responses"
            control={
              <Checkbox
                checked={testDetails.data.stopReceivingRes || false}
                color="primary"
                name="policy"
                onChange={evt => testDetails.update({ stopReceivingRes: evt.target.checked })}
              />
            }
          />
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title="Click to fold or expand all cards">
          <FormControlLabel
            label="Collapse All"
            control={
              <Checkbox
                color="primary"
                checked={testDetails.data.items.every(v => v.collapsed)}
                indeterminate={
                  testDetails.data.items.some(v => v.collapsed) && !testDetails.data.items.every(v => v.collapsed)
                }
                onChange={e => testDetails.collapseAll(e.target.checked)}
              />
            }
          />
        </Tooltip>
      </Grid>
      <Grid item>
        <TestSettingsDialog settings={testDetails.data.settings} />
      </Grid>
      <Grid item>
        <Tooltip title="Preview Test">
          <ResponsePreviewDialog testUrl={testUrl} taskModel={testDetails.data} />
        </Tooltip>
      </Grid>
      <Grid item>
        <Tooltip title={testDetails.isChanged ? 'You must SAVE first' : 'Open and share this test'}>
          <span>
            <IconButton
              onClick={() => shareDialogState[1](true)}
              disabled={testDetails.isChanged || !testDetails.data._id}>
              <Icon>share</Icon>
            </IconButton>
          </span>
        </Tooltip>
        <ShareLinkDialog taskUrl={testUrl} task={testDetails.data} shareDialogState={shareDialogState} />
      </Grid>
      <Grid item>
        <Button color="primary" variant="contained" onClick={handleSubmit} disabled={!testDetails.isChanged}>
          Save{!testDetails.isChanged && 'd'}
        </Button>
      </Grid>
    </Grid>
  );
});
