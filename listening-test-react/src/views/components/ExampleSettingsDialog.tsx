import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {ItemExampleSettingsModel} from "../../shared/models/ItemExampleModel";
import {Icon, IconButton} from "@material-ui/core";
import {useFormik} from "formik";
import {observer} from "mobx-react";

export const ExampleSettingsDialog = observer(function(props: { settings: ItemExampleSettingsModel, onConfirm: (settings: ItemExampleSettingsModel) => void }) {
  const {settings, onConfirm} = props;
  const [open, setOpen] = useState(false);
  const formik = useFormik({
    initialValues: {loopTimes: 0, ...settings},
    onSubmit: values => {
      onConfirm(values);
      handleClose();
    }
  });

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  return <>
    <IconButton onClick={handleClickOpen}><Icon>settings</Icon></IconButton>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">Example Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Leaving blank or 0 the audio means audios will be looped infinite times.
          </DialogContentText>
          <TextField label="Loop times" fullWidth type="number" {...formik.getFieldProps('loopTimes')}
                     onFocus={event => event.target.select()}/>
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
})
