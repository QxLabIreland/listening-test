import {observer} from "mobx-react";
import {UserModel} from "../../shared/models/UserModel";
import React, {useContext, useState} from "react";
import {GlobalSnackbar} from "../../shared/ReactContexts";
import Axios from "axios";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Icon,
  TextField,
  Tooltip
} from "@material-ui/core";

const fullPermissions = ['User', 'Template', 'Storage', 'Video', 'Testing'];

export const ManagePermissionDialog = observer(function ({user}: { user: UserModel }) {
  const [open, setOpen] = React.useState(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const openSnackbar = useContext(GlobalSnackbar);

  const handleAddPermission = (newPermission: string, user: UserModel) => {
    // Adding processing prevents user click too many times
    setProcessing(true);
    Axios.post('/api/users', {newPermission, _id: user._id}).then((res) => {
      user.permissions = res.data;
      setProcessing(false);
    }, reason => {
      openSnackbar(reason.response.data, undefined, 'error');
      setProcessing(false);
    });
  }
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleStorageAllocatedChange = () => {
    Axios.patch('/api/storage-allocation', user).then()
  };
  const handleStorageAllocatedReset = () => {
    user.storageAllocated = 524_288_000;
    handleStorageAllocatedChange();
  };

  return (<>
    <Tooltip title="Click to view all permissions">
      <Button color="primary" onClick={handleClickOpen} autoCapitalize='disabled'>{
        fullPermissions.every(p => user.permissions?.includes(p))
          ? 'Admin'
          : !user.permissions || user.permissions.length === 0
            ? 'Add'
            : user.permissions.slice(0,2).toString() + (user.permissions.length > 2 ? '...' : '')
      }</Button>
    </Tooltip>
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Mange permissions for {user.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">Permissions Allowed</DialogContentText>
        {fullPermissions.map(per =>
          <FormControlLabel key={per} label={per} disabled={processing} control={
            <Checkbox color="primary" checked={user.permissions?.indexOf(per) > -1}
                      onChange={() => handleAddPermission(per, user)}/>}
          />
        )}
        <DialogContentText/>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField variant="standard" label="Storage allowed in MB" type="number"
                       value={(user.storageAllocated ?? 524_288_000) / 1024 ** 2} onBlur={handleStorageAllocatedChange}
                       onChange={e => user.storageAllocated = Number(e.target.value) * 1024 ** 2}/>
          </Grid>
          <Grid item>
            <Button type="button" color="primary" onClick={handleStorageAllocatedReset}
                    startIcon={<Icon>restore</Icon>}>
              Reset limit
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>Ok</Button>
      </DialogActions>
    </Dialog>
  </>);
});
