import React, {useContext, useState} from "react";
import {SignUpWhitelistModel} from "../../shared/models/SignUpWhitelistModel";
import {GlobalDialog} from "../../shared/ReactContexts";
import Axios from "axios";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Tooltip
} from "@material-ui/core";

export function ManageWhitelist() {
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
              <TextField fullWidth variant="standard"
                         label={currentTab === 0 ? 'Institution Domain (without @)' : 'Email Address'}
                         type={currentTab === 0 ? 'text' : 'email'} value={textValue}
                         onChange={event => setTextValue(event.target.value)}/>
            </Grid>
            <Grid item>
              <Button startIcon={<Icon>add</Icon>} color="primary" onClick={handleAdd}
                      disabled={!textValue}>Add</Button>
            </Grid>
            <Grid item>
              <Button startIcon={<Icon>remove</Icon>} color="secondary" onClick={handleDelete}
                      disabled={!textValue}>Delete</Button>
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
