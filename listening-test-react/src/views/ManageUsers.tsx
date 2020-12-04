import React, {useContext, useEffect, useState} from "react";
import Axios from "axios";
import {
  Box,
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
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField, Tooltip
} from "@material-ui/core";
import SearchInput from "../shared/components/SearchInput";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Loading from "../layouts/components/Loading";
import {UserModel} from "../shared/models/UserModel";
import {GlobalDialog, GlobalSnackbar} from "../shared/ReactContexts";
import {SignUpWhitelistModel} from "../shared/models/SignUpWhitelistModel";

export default function ManageUsers() {
  const [data, setData] = useState<UserModel[]>();
  const [searchStr, setSearchStr] = useState<string>('');
  const [error, setError] = useState();

  useEffect(() => {
    Axios.get<UserModel[]>('/api/users').then((res) => {
      setData(res.data);
    }, reason => setError(reason.response.data));
  }, []);

  // Filter data through search input
  const getFilterData = () => data.filter(value =>
    // Name, email and permissions searching
    [value.name, value.email, value.permissions?.toString()].toString().toLowerCase().includes(searchStr.toLowerCase())
  );

  return <Grid container spacing={2}>
    <Grid item container xs={12}>
      <Grid item xs={12} md={6}>
        <SearchInput placeholder="Search names/emails/permissions"
                     onChange={(event: any) => setSearchStr(event.target.value)}/>
      </Grid>
      <Grid item xs={12} md={6} style={{display: 'flex', alignItems: 'center', paddingTop: 9}}>
        <span style={{flexGrow: 1}}/>
        <ManageWhitelist/>
      </Grid>
    </Grid>
    <Grid item xs={12}>
      {data ? <Card><CardContent style={{padding: 0}}><Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            {/*<TableCell>Space Allowed</TableCell>*/}
            <TableCell>Permissions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? getFilterData().map(user => <TableRow hover key={user._id.$oid}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            {/*<TableCell>500MB</TableCell>*/}
            <TableCell><ManagePermissionDialog user={user}/></TableCell>
          </TableRow>) : <TableRow>
            <TableCell colSpan={4}>There is no user</TableCell>
          </TableRow>}
        </TableBody>
      </Table></CardContent></Card> : <Loading error={error}/>}
    </Grid>
  </Grid>
}

const fullPermissions = ['User', 'Template', 'Storage', 'Video'];

function ManagePermissionDialog({user}: { user: UserModel }) {
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
    <Button color="primary" onClick={handleClickOpen}>View</Button>
    <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Mange permissions for {user.name}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">Permissions</DialogContentText>
        {fullPermissions.map(per =>
          <FormControlLabel key={per} label={per} disabled={processing} control={
            <Checkbox color="primary" checked={user.permissions?.indexOf(per) > -1}
                      onChange={() => handleAddPermission(per, user)}/>}
          />
        )}
        {/*<TextField variant="standard" label="Storage space allowed"/>*/}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>Ok</Button>
      </DialogActions>
    </Dialog>
  </>);
}

function ManageWhitelist() {
  const [open, setOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [data, setData] = useState<SignUpWhitelistModel>();
  const [textValue, setTextValue] = useState('');
  const openDialog = useContext(GlobalDialog);

  const getData = () => {
    Axios.get<SignUpWhitelistModel>('/api/whitelist').then(res => setData(res.data), res => openDialog(res.response.statusText));
  }
  const handleClickOpen = () => {
    setOpen(true);
    getData();
  }
  const handleClose = () => setOpen(false);
  const handleTabChange = (event: React.ChangeEvent<any>, newValue: number) => setCurrentTab(newValue);
  const handleAdd = () =>
    Axios.post('/api/whitelist', currentTab === 0 ? {domain: textValue} : {email: textValue}).then(getData);
  const handleDelete = () =>
    Axios.delete('/api/whitelist', {data: currentTab === 0 ? {domain: textValue} : {email: textValue}}).then(getData);
  const getFilterData = () => (currentTab === 0 ? data?.domains : data?.emails)?.filter(value => value.includes(textValue));

  return (<>
    <Button color="primary" variant="contained" onClick={handleClickOpen}>Sign Up Whitelist</Button>
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth aria-labelledby="whitelist-dialog-title"
            aria-describedby="whitelist-dialog-description">
      <DialogTitle id="whitelist-dialog-title">Mange Sign Up Whitelist</DialogTitle>
      <DialogContent>

        <DialogContentText id="alert-dialog-description">
          Here you can add domains and email address into sign up whitelist,
          so people with these domain and emails are able to sign up for their own account.
          DO NOT ADD General Domain, such as gmail.com and outlook.com.
        </DialogContentText>
        <Tabs value={currentTab} onChange={handleTabChange} indicatorColor="primary" aria-label="Whitelist tab">
          <Tab label="Domain" value={0}/>
          <Tab label="Email address" value={1}/>
        </Tabs>
        <Box pt={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField fullWidth variant="standard" label={currentTab === 0 ? 'Institution Domain (without @)' : 'Email Address'}
                         type={currentTab === 0 ? 'text' : 'email'} value={textValue}
                         onChange={event => setTextValue(event.target.value)}/>
            </Grid>
            <Grid item>
              <Button startIcon={<Icon>add</Icon>} color="primary" onClick={handleAdd} disabled={!textValue}>Add</Button>
            </Grid>
            <Grid item>
              <Button startIcon={<Icon>remove</Icon>} color="secondary" onClick={handleDelete} disabled={!textValue}>Delete</Button>
            </Grid>
            <Grid item>
              <Tooltip title="If you wanna add, just enter text right and click add. To delete, enter EXACT domain or
              email address and click delete. The list on the bottom will change if add or delete successfully. Please
              note the text box will search what you entered.">
                <Icon>help_outline</Icon>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <List dense>
                {getFilterData()?.map(value => <ListItem><ListItemText primary={value}/></ListItem>)}
                {textValue && <ListItem><ListItemText secondary="(empty text box to see full list)"/></ListItem>}
              </List>
            </Grid>
          </Grid>
        </Box>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>Ok</Button>
      </DialogActions>
    </Dialog>
  </>);
}
