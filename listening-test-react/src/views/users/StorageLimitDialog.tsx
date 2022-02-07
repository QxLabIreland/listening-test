import {UserModel} from "../../shared/models/UserModel";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  TextField,
  Tooltip
} from "@material-ui/core";
import React from "react";
import {observer} from "mobx-react";
import Axios from "axios";
import {fmtFileSize} from "../../shared/tools/UncategorizedTools";
import {DEFAULT_STORAGE_LIMIT} from "../../shared/constants";


export const StorageLimitDialog = observer(({user}: { user: UserModel }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleStorageAllocatedChange = () => {
    Axios.patch('/api/storage-allocation', user).then()
  };
  const handleStorageAllocatedReset = () => {
    user.storageAllocated = DEFAULT_STORAGE_LIMIT;
    handleStorageAllocatedChange();
  };
  return (<>
    <Tooltip title="Click to modify storage limit">
      <Button color="primary" onClick={handleClickOpen}>
        {fmtFileSize(user.storageAllocated ?? DEFAULT_STORAGE_LIMIT)}
      </Button>
    </Tooltip>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="alert-dialog-title">Mange storage limit for {user.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField variant="standard" label="Storage allowed in MB" type="number"
                       value={(user.storageAllocated ?? DEFAULT_STORAGE_LIMIT) / 1024 ** 2} onBlur={handleStorageAllocatedChange}
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
        <Button color="primary" onClick={handleClose} autoFocus>Ok</Button>
      </DialogActions>
    </Dialog>
  </>);
});
