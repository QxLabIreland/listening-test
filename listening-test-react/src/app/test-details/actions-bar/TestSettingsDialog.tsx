import { useFormik } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';

import { Checkbox, FormControlLabel, FormGroup, IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Icon from '@mui/material/Icon';

import { TestSettingsModel } from '../../../shared/models/BasicTaskModel';
import { testDetails } from '../test-details-store';

export default observer(function TestSettingsDialog(props: { settings: TestSettingsModel }) {
  const [open, setOpen] = React.useState(false);
  const formik = useFormik<TestSettingsModel>({
    initialValues: { isIndividual: false, isTimed: false },
    onSubmit: values => {
      testDetails.updateSettings(values);
      setOpen(false);
    },
  });

  const handleClickOpen = () => {
    formik.setValues({ isIndividual: false, isTimed: false, ...props.settings });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  return (
    <>
      <Tooltip title="Test Global Settings">
        <IconButton onClick={handleClickOpen} id="testGlobalSettingButton">
          <Icon>settings</Icon>
        </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle id="form-dialog-title">Test Global Settings</DialogTitle>
          <DialogContent>
            <DialogContentText>Settings for the whole test</DialogContentText>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={formik.values.isIndividual} {...formik.getFieldProps('isIndividual')} />}
                label="Show each question individually"
              />
              <FormControlLabel
                control={<Checkbox checked={formik.values.isTimed} {...formik.getFieldProps('isTimed')} />}
                label="Time each question"
              />
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" type="button">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
});
