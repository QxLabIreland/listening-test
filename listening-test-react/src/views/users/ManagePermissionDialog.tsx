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

  return (<>
    <Tooltip title="Click to view all permissions">
      <Button color="primary" onClick={handleClickOpen} autoCapitalize='disabled'>{
        fullPermissions.every(p => user.permissions?.includes(p))
          ? 'Admin'
          : !user.permissions || user.permissions.length === 0
            ? 'Add'
            : user.permissions.slice(0, 2).toString() + (user.permissions.length > 2 ? '...' : '')
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>Ok</Button>
      </DialogActions>
    </Dialog>
  </>);
});
