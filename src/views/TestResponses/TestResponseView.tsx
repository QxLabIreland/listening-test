import React, {useState} from 'react';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  createStyles,
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

const useStyles = makeStyles((theme: Theme) => (createStyles({
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  actions: {
    justifyContent: 'flex-end'
  }
})));

export default function () {
  const [responses] = useState([
    {
      id: 1,
      name: 'Ekaterina Tankova',
      testRef: 1,
      createdAt: 1555016400000,
      selected: false
    },
  ]);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    responses.forEach(u => u.selected = event.target.checked);
  };

  const handleSelectOne = (event, user) => {
    user.selected = event.target.checked;
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card>
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox checked={responses.every(value => value.selected)} color="primary"
                            indeterminate={responses.some(value => value.selected)} onChange={handleSelectAll}/>
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Test</TableCell>
                <TableCell>Registration date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{responses.slice(0, rowsPerPage).map(user => (
              <TableRow hover key={user.id} selected={user.selected}>
                <TableCell padding="checkbox">
                  <Checkbox checked={user.selected} color="primary" onChange={event => handleSelectOne(event, user)}
                            value="true"/>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell><Link to="ab-test">{user.testRef}</Link></TableCell>
                <TableCell>{user.createdAt}</TableCell>
              </TableRow>
            ))}</TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination component="div" count={responses.length} onChangePage={handlePageChange}
                         onChangeRowsPerPage={handleRowsPerPageChange} page={page} rowsPerPage={rowsPerPage}
                         rowsPerPageOptions={[5, 10, 25]}/>
      </CardActions>
    </Card>
  );
};
