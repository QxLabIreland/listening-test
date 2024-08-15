import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Checkbox, FormControlLabel, Icon, IconButton, Tooltip} from "@mui/material";
import {useFormik} from "formik";
import {observer} from "mobx-react";
import {ImageExampleSettingsModel} from "../../../shared/models/ImageTaskModel";

const initialValues: ImageExampleSettingsModel = {
  isHorizontalDisplay: false
};

export const ImageAbExampleSettings = observer(function (props: {
  settings: ImageExampleSettingsModel, onConfirm: (newSettings: ImageExampleSettingsModel) => void
}) {
  // Add disable prop that allow to disable some settings
  const {settings, onConfirm} = props;
  const [open, setOpen] = useState(false);
  const formik = useFormik<ImageExampleSettingsModel>({
    initialValues: {...initialValues}, onSubmit: values => {
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
    <Tooltip title="Image Display Settings">
      <IconButton onClick={handleClickOpen}><Icon>settings</Icon></IconButton>
    </Tooltip>
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Image Display Settings</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={<Checkbox checked={formik.values.isHorizontalDisplay} {...formik.getFieldProps('isHorizontalDisplay')}/>}
            label="Display images horizontally"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" type="button">Cancel</Button>
          <Button color="primary" type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  </>;
});

