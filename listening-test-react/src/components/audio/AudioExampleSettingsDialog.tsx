import { useFormik } from 'formik';
import { observer } from 'mobx-react';
import React, { useState } from 'react';

import { Checkbox, FormControlLabel, Icon, IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { AudioExampleSettingsModel } from '../../shared/models/AudioTestModel';

const initialValues: AudioExampleSettingsModel = {
  loopTimes: 0,
  requireClipEnded: false,
  sectionLooping: false,
  disablePlayerSlider: false,
  randomMedia: false,
  fixLastInternalQuestion: false,
};

export const AudioExampleSettingsDialog = observer(function (props: {
  settings: AudioExampleSettingsModel;
  onConfirm: (settings: AudioExampleSettingsModel) => void;
  disableSectionLoop?: boolean;
  disableRandomAudio?: boolean;
  enableFixLastInternalQuestion?: boolean;
  enableAlwaysStartFrom0?: boolean;
}) {
  // Add disable prop that allow to disable some settings
  const {
    settings,
    onConfirm,
    disableSectionLoop,
    disableRandomAudio,
    enableFixLastInternalQuestion,
    enableAlwaysStartFrom0,
  } = props;
  const [open, setOpen] = useState(false);
  const formik = useFormik<AudioExampleSettingsModel>({
    initialValues: { ...initialValues },
    onSubmit: (values) => {
      onConfirm(values);
      handleClose();
    },
  });

  const handleClickOpen = () => {
    formik.setValues({ ...initialValues, ...settings });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return <>
    <Tooltip title="Audio Playback Settings">
      <IconButton onClick={handleClickOpen} size="large">
        <Icon>settings</Icon>
      </IconButton>
    </Tooltip>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">Audio Playback Settings</DialogTitle>
        <DialogContent>
          <TextField
            label="Loop times"
            type="number"
            {...formik.getFieldProps('loopTimes')}
            onFocus={(event) => event.target.select()}
          />
          <DialogContentText>
            Set the number of times you wish the audio to loop. Setting this value to "0" will result in infinite
            looping.
          </DialogContentText>

          <FormControlLabel
            control={
              <Checkbox checked={formik.values.requireClipEnded} {...formik.getFieldProps('requireClipEnded')} />
            }
            label="Require the user to listen to each example in full (at least once)"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.disablePlayerSlider}
                {...formik.getFieldProps('disablePlayerSlider')}
              />
            }
            label="Disable audio player seek bar (User cannot skip forward or back in time)"
          />

          {!disableSectionLoop && (
            <FormControlLabel
              control={
                <Checkbox checked={formik.values.sectionLooping} {...formik.getFieldProps('sectionLooping')} />
              }
              label="Show section looping slider bar"
            />
          )}
          {!disableRandomAudio && (
            <FormControlLabel
              control={<Checkbox checked={formik.values.randomMedia} {...formik.getFieldProps('randomMedia')} />}
              label="Randomize media files"
            />
          )}
          {enableFixLastInternalQuestion && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.fixLastInternalQuestion}
                  {...formik.getFieldProps('fixLastInternalQuestion')}
                />
              }
              label="Don't randomize final question"
            />
          )}
          <br />
          {enableAlwaysStartFrom0 && (
            <FormControlLabel
              control={
                <Checkbox checked={formik.values.alwaysStartFrom0} {...formik.getFieldProps('alwaysStartFrom0')} />
              }
              label="Audio always start from 00:00"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" type="button">
            Cancel
          </Button>
          <Button color="primary" type="submit">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  </>;
});
