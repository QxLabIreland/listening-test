import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {Checkbox, FormControlLabel, Icon, IconButton, Tooltip} from "@material-ui/core";
import {useFormik} from "formik";

const initialValues: ItemExampleSettingsModel = {
  loopTimes: null, requireClipEnded: false, sectionLooping: false, disablePlayerSlider: false
};

export default function ExampleSettingsDialog(props: { settings: ItemExampleSettingsModel, onConfirm: (settings: ItemExampleSettingsModel) => void }) {
  const {settings, onConfirm} = props;
  const [open, setOpen] = useState(false);
  const formik = useFormik<ItemExampleSettingsModel>({
    initialValues: {...initialValues},
    onSubmit: values => {
      onConfirm(values);
      handleClose();
    }
  });

  const handleClickOpen = () => {
    formik.setValues({...initialValues, ...settings});
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  return <>
    <Tooltip title="Audio Playback Settings">
      <IconButton onClick={handleClickOpen}><Icon>settings</Icon></IconButton>
    </Tooltip>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">Audio Playback Settings</DialogTitle>
        <DialogContent>
          <TextField label="Loop times" type="number" {...formik.getFieldProps('loopTimes')}
                     onFocus={event => event.target.select()}/>
          <DialogContentText>
            Set the number of times you wish the audio to loop. Setting this value to "0" will result in infinite
            looping.
          </DialogContentText>

          <FormControlLabel
            control={<Checkbox checked={formik.values.requireClipEnded} {...formik.getFieldProps('requireClipEnded')}/>}
            label="Require the user to listen to each example in full"
          />

          <FormControlLabel
            control={<Checkbox checked={formik.values.disablePlayerSlider} {...formik.getFieldProps('disablePlayerSlider')}/>}
            label="Disable audio player slider bar (can't change position of thumb)"
          />

          <FormControlLabel
            control={<Checkbox checked={formik.values.sectionLooping} {...formik.getFieldProps('sectionLooping')}/>}
            label="Show section looping slider bar"
          />
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
}
