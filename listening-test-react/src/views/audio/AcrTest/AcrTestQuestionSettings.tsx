import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Icon, IconButton, Tooltip} from "@material-ui/core";
import {useFormik} from "formik";
import {observer} from "mobx-react";

interface AcrTestQuestionsSettingsModel {

}

const initialValues: AcrTestQuestionsSettingsModel = {

};

export const ArcTestQuestionsSettings = observer(function (props: {
  settings: AcrTestQuestionsSettingsModel, onConfirm: (settings: AcrTestQuestionsSettingsModel) => void
}) {
  // Add disable prop that allow to disable some settings
  const {settings, onConfirm} = props;
  const [open, setOpen] = useState(false);
  const formik = useFormik<AcrTestQuestionsSettingsModel>({
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
    <Tooltip title="Questions Settings">
      <IconButton onClick={handleClickOpen}><Icon>settings</Icon></IconButton>
    </Tooltip>
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Audio Playback Settings</DialogTitle>
        <DialogContent>

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
