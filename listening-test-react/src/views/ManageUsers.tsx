import {TestUrl} from "../shared/models/EnumsAndTypes";
import React, {useContext, useEffect, useState} from "react";
import Axios from "axios";
import {Checkbox, FormControlLabel, Grid, Icon, IconButton} from "@material-ui/core";
import SearchInput from "../shared/components/SearchInput";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import TableBody from "@material-ui/core/TableBody";
import Loading from "../layouts/components/Loading";
import {UserModel} from "../shared/models/UserModel";
import {GlobalSnackbar} from "../shared/ReactContexts";

const fullPermissions = ['User', 'Template'];

export default function ManageUsers() {
  const [data, setData] = useState<UserModel[]>();
  const [searchStr, setSearchStr] = useState<string>('');
  const [error, setError] = useState();
  const openSnackbar = useContext(GlobalSnackbar);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    Axios.get<UserModel[]>('/api/users').then((res) => {
      setData(res.data);
    }, reason => setError(reason.response.data));
  }, []);

  const getFilterData = () => data.filter(value =>
    // Name, email and permissions searching
    [value.name, value.email, value.permissions?.toString()].toString().toLowerCase().includes(searchStr.toLowerCase())
  );

  const handleAddPermission = (newPermission: string, user: UserModel) => {
    // Adding processing prevents user click too many times
    setProcessing(true);
    Axios.post('/api/users', {newPermission, _id: user._id}).then((res) => {
      user.permissions = res.data;
      setProcessing(false);
    }, reason => {
      openSnackbar(reason.response.data);
      setProcessing(false);
    });
  }

  return <Grid container spacing={2}>
    <Grid item container xs={12}>
      <Grid item xs={12} md={6}>
        <SearchInput placeholder="Search tests" onChange={(event: any) => setSearchStr(event.target.value)}/>
      </Grid>
    </Grid>
    <Grid item xs={12}>
      {data ? <Card><CardContent style={{padding: 0}}><Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Permissions</TableCell>
            <TableCell/>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length ? getFilterData().map(user => <TableRow hover key={user._id.$oid}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{fullPermissions.map(per =>
              <FormControlLabel label={per} disabled={processing} control={
                <Checkbox checked={user.permissions?.indexOf(per) > -1}
                          onChange={() => handleAddPermission(per, user)}/>}
              />
            )}</TableCell>
            <TableCell>
              <Tooltip title="Reset password">
                <IconButton size="small"
                            color="primary"><Icon>rotate_left</Icon></IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>) : <TableRow><TableCell colSpan={4}>There is no user</TableCell></TableRow>}
        </TableBody>
      </Table></CardContent></Card> : <Loading error={!!error} message={error}/>}
    </Grid>
  </Grid>
}
