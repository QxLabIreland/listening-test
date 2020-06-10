import * as React from "react";
import {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import TableBody from "@material-ui/core/TableBody";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {useRouteMatch} from 'react-router';
import SearchInput from "../components/SearchInput";
import {Grid} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
  content: {
    padding: 0
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  button: {
    marginRight: theme.spacing(1)
  }
}));


export default function () {
  const classes = useStyles();
  const {path} = useRouteMatch();

  const [orders] = useState([
    {
      id: 1,
      ref: 'CDD1049',
      amount: 30.5,
      customer: {
        name: 'Ekaterina Tankova'
      },
      createdAt: 1555016400000,
      status: 'pending'
    },
    {
      id: 2,
      ref: 'CDD1048',
      amount: 25.1,
      customer: {
        name: 'Cao Yu'
      },
      createdAt: 1555016400000,
      status: 'delivered'
    },
    {
      id: 3,
      ref: 'CDD1047',
      amount: 10.99,
      customer: {
        name: 'Alexa Richardson'
      },
      createdAt: 1554930000000,
      status: 'refunded'
    }
  ]);

  const [filteredOrders, setFilteredOrders] = useState(orders);

  useEffect(() => {
    setFilteredOrders(orders);
  },[orders])

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setFilteredOrders(orders.filter(value =>
      value.customer.name.toLowerCase().includes(event.target.value.toLowerCase())
    ))
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.row}>
        <span className={classes.spacer}/>
        <Button color="primary" variant="contained" component={Link} to={`${path}/0`}>
          Add test
        </Button>
      </Grid>
      <Grid item xs={12} className={classes.row}>
        <SearchInput className={classes.button} placeholder="Search tests" onChange={handleSearchChange}/>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent className={classes.content}>
            <div>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Test No.</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell sortDirection="desc">
                      <Tooltip enterDelay={300} title="Sort">
                        <TableSortLabel active direction="desc">
                          Creation Date
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map(order => (
                    <TableRow hover key={order.id}>
                      <TableCell>{order.ref}</TableCell>
                      <TableCell>{order.customer.name}</TableCell>
                      <TableCell>
                        {order.createdAt}
                        {/*{moment(order.createdAt).format('DD/MM/YYYY')}*/}
                      </TableCell>
                      <TableCell>
                        <Button className={classes.button} variant='outlined' color="primary" component={Link}
                                to={`${path}/${order.id}`}>Edit</Button>
                        <Button className={classes.button} variant='outlined' color="primary" component={Link}
                                to={`/task/ab-test/${order.id}`}>View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

  );
}
