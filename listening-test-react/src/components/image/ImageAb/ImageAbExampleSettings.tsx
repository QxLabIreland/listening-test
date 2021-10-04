import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Checkbox, FormControlLabel, Icon, IconButton, Tooltip} from "@material-ui/core";
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

