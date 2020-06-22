import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Theme,
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../shared/components/Loading";
import SearchInput from "../components/SearchInput";

const useStyles = makeStyles((theme: Theme) => (createStyles({
  content: {
    padding: 0
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginLeft: 8,
  }
})));

export default function TestResponseView(props: { testType: 'abTest' | 'mushra', prefix }) {
  const classes = useStyles();
  // Prefix is the router prefix of a detail
  const {testType, prefix} = props;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [responses, setResponse] = useState(null);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    Axios.get('/api/response', {params: {testType: testType}})
      .then(res => setResponse(res.data), reason => setError(reason.response.statusText));
  }, [testType])

  const handleSelectAll = event => {
    currentPageList().forEach(res => res.selected = event.target.checked);
    setResponse([...responses]);
  }
  const handleSelectOne = (event, res) => {
    res.selected = event.target.checked;
    setResponse([...responses]);
  }
  const handlePageChange = (event, page) => setPage(page);
  const handleRowsPerPageChange = event => setRowsPerPage(event.target.value);

  const handleDelete = () => {
    const deletedList = responses.filter(r => r.selected).map(r => r._id);
    Axios.delete('/api/response', {params: {testType: testType}, data: deletedList})
      .then(() => setResponse(responses.filter(r => !r.selected)))
  }
  const currentPageList = () => responses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (<Grid container spacing={1}>
    <Grid item xs={12} container spacing={1}>
      <Grid item xs={12} md={6}>
        <SearchInput/>
        <Box mt={1} ml={6} style={{position: 'absolute', zIndex: 1}}>
          <Paper elevation={3}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button>
                <ListItemText primary="Inbox"/>
              </ListItem>
              <ListItem button>
                <ListItemText primary="Drafts"/>
              </ListItem>
            </List>
          </Paper>
        </Box>
      </Grid>
    </Grid>
    <Grid item xs={12}>
      {responses ? <Card>
        <CardContent className={classes.content}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={currentPageList().every(value => value.selected)} color="primary"
                            indeterminate={currentPageList().some(value => value.selected) && !currentPageList().every(value => value.selected)}
                            onChange={handleSelectAll}/>
                </TableCell>
                <TableCell>Test Name</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>{currentPageList().map(r =>
              <TableRow hover key={r._id.$oid}>
                <TableCell padding="checkbox">
                  <Checkbox checked={!!r.selected} color="primary" onChange={event => handleSelectOne(event, r)}/>
                </TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{new Date(r.createdAt?.$date).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton size="small" component={Link} to={`${prefix}/${r._id.$oid}`} className={classes.button}>
                    <Icon>pageview</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            )}</TableBody>
          </Table> </CardContent>
        <CardActions className={classes.actions}>
          <TablePagination component="div" count={responses.length} onChangePage={handlePageChange}
                           onChangeRowsPerPage={handleRowsPerPageChange} page={page} rowsPerPage={rowsPerPage}
                           rowsPerPageOptions={[10, 25, 50]}/>
        </CardActions>
      </Card> : <Loading error={!!error} message={error}/>}
    </Grid>
    <Grid item xs={12} className={classes.actions}>
      <Button variant="contained" className={classes.button} onClick={handleDelete}><Icon>delete</Icon>Delete</Button>
      {/*<Button variant="contained" color="primary" className={classes.button}><Icon>get_app</Icon>Download Responses</Button>*/}
    </Grid>
  </Grid>);
};
