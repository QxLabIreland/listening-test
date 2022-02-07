import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import Axios from "axios";
import {Checkbox, Grid} from "@material-ui/core";
import SearchInput from "../../components/utils/SearchInput";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Loading from "../../layouts/components/Loading";
import {UserModel} from "../../shared/models/UserModel";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {ManagePermissionDialog} from "./ManagePermissionDialog";
import {ManageWhitelist} from "./ManageWhitelistDialog";
import {GlobalSnackbar} from "../../shared/ReactContexts";
import {StorageLimitDialog} from "./StorageLimitDialog";

export const ManageUsers = observer(function () {
  const [data, setData] = useState<UserModel[]>();
  const [searchStr, setSearchStr] = useState<string>('');
  const [error, setError] = useState();

  useEffect(() => {
    Axios.get<UserModel[]>('/api/users').then((res) => {
      setData(observable(res.data));
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
        <SearchInput placeholder="Search by names/emails/permissions"
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
            <TableCell>Storage Limit</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell>Activated</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? getFilterData().map(user => <TableRow hover key={user._id.$oid}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell><StorageLimitDialog user={user}/></TableCell>
            <TableCell><ManagePermissionDialog user={user}/></TableCell>
            <TableCell><ActivationCheckbox user={user}/></TableCell>
          </TableRow>) : <TableRow>
            <TableCell colSpan={4}>There is no user</TableCell>
          </TableRow>}
        </TableBody>
      </Table></CardContent></Card> : <Loading error={error}/>}
    </Grid>
  </Grid>
});

const ActivationCheckbox = observer(({user}: { user: UserModel }) => {
  const openSnackbar = useContext(GlobalSnackbar);

  const handleActivatedChange = (event: ChangeEvent<HTMLInputElement>, user: UserModel) => {
    Axios.patch(`/api/user/${user._id.$oid}`).then(() => {
        user.activated = !user.activated;
        openSnackbar(`The user has been ${user.activated ? 'activated' : 'deactivated'}.`, 6_000, 'success');
      }
      , () => openSnackbar('Activation failed.', 6_000, 'error')
    );
  }
  return <Checkbox checked={user.activated ?? false}
                   onChange={event => handleActivatedChange(event, user)}/>
})

