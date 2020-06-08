import React, {useState} from 'react';
import {
  Avatar,
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
  Typography
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => (createStyles({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
})));

const MushraPage = () => {
  const users = [
    {
      id: 0,
      name: 'Ekaterina Tankova',
      address: {
        country: 'USA',
        state: 'West Virginia',
        city: 'Parkersburg',
        street: '2849 Fulton Street'
      },
      email: 'ekaterina.tankova@devias.io',
      phone: '304-428-3097',
      avatarUrl: '/images/avatars/avatar_3.png',
      createdAt: 1555016400000,
      selected: false
    },
  ];
  const [selectedCount] = useState(0);

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    users.forEach(u => u.selected = event.target.checked);
  };

  const handleSelectOne = (event, id) => {
    const one = users.find(u => u.id === id);
    if (one) one.selected = true;
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card
      className={classes.root}
    >
      <CardContent className={classes.content}>
        <div className={classes.inner}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCount === users.length}
                    color="primary"
                    indeterminate={selectedCount > 0 && selectedCount < users.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Registration date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.slice(0, rowsPerPage).map(user => (
                <TableRow
                  hover
                  key={user.id}
                  selected={user.selected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={user.selected}
                      color="primary"
                      onChange={event => handleSelectOne(event, user.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <div className={classes.nameContainer}>
                      <Avatar
                        className={classes.avatar}
                        src={user.avatarUrl}
                      >
                      </Avatar>
                      <Typography variant="body1">{user.name}</Typography>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.address.city}, {user.address.state},{' '}
                    {user.address.country}
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {user.createdAt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

export default MushraPage;
