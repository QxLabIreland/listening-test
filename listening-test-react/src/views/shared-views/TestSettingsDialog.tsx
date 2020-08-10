import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Checkbox, FormControlLabel, FormGroup, IconButton, Tooltip} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {TestSettingsModel} from "../../shared/models/BasicTestModel";
import {useFormik} from "formik";

export default function TestSettingsDialog(props: { settings: TestSettingsModel, onConfirm: (settings: TestSettingsModel) => void }) {
  const [open, setOpen] = React.useState(false);
  const formik = useFormik<TestSettingsModel>({
    initialValues: {isIndividual: false, isTimed: false},
    onSubmit: values => {
      props.onConfirm(values);
      setOpen(false);
    }
  });

  const handleClickOpen = () => {
    formik.setValues({isIndividual: false, isTimed: false, ...props.settings});
    setOpen(true);
  }
  const handleClose = () => setOpen(false);

  return <>
    <Tooltip title="Test Global Settings">
      <IconButton onClick={handleClickOpen}><Icon>settings</Icon></IconButton>
    </Tooltip>
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">Test settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Settings for the whole test
          </DialogContentText>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={formik.values.isIndividual} {...formik.getFieldProps('isIndividual')}/>}
              label="Show each question individually"
            />
            <FormControlLabel
              control={<Checkbox checked={formik.values.isTimed} {...formik.getFieldProps('isTimed')}/>}
              label="Time each question"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" type="button">Cancel</Button>
          <Button color="primary" type="submit">Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  </>
}
