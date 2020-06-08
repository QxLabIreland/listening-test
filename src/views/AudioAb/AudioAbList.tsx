import * as React from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import CardActions from "@material-ui/core/CardActions";
import TableBody from "@material-ui/core/TableBody";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Icon from "@material-ui/core/Icon";
import {makeStyles} from "@material-ui/core/styles";
import {Link} from "react-router-dom";
import {useRouteMatch} from 'react-router';

const useStyles = makeStyles(theme => ({
  content: {
    padding: 0
  }
}));


export default function AudioAbList() {
  const classes = useStyles();
  const {path} = useRouteMatch();

  const orders = [
    {
      id: 0,
      ref: 'CDD1049',
      amount: 30.5,
      customer: {
        name: 'Ekaterina Tankova'
      },
      createdAt: 1555016400000,
      status: 'pending'
    },
    {
      id: 1,
      ref: 'CDD1048',
      amount: 25.1,
      customer: {
        name: 'Cao Yu'
      },
      createdAt: 1555016400000,
      status: 'delivered'
    },
    {
      id: 2,
      ref: 'CDD1047',
      amount: 10.99,
      customer: {
        name: 'Alexa Richardson'
      },
      createdAt: 1554930000000,
      status: 'refunded'
    }
  ];
  return (
    <Card>
      <CardContent className={classes.content}>
        <div>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test No.</TableCell>
                <TableCell>Name</TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip
                    enterDelay={300}
                    title="Sort"
                  >
                    <TableSortLabel
                      active
                      direction="desc"
                    >
                      Creation Date
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell/>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(order => (
                <TableRow
                  hover
                  key={order.id}
                >
                  <TableCell>{order.ref}</TableCell>
                  <TableCell>{order.customer.name}</TableCell>
                  <TableCell>
                    {order.createdAt}
                    {/*{moment(order.createdAt).format('DD/MM/YYYY')}*/}
                  </TableCell>
                  <TableCell>
                    <Button variant='outlined' component={Link} to={`${path}/${order.id}`}>Edit</Button>
                    <Button variant='outlined' component={Link} to={`/task/audio-ab/${order.id}`}>View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          View all <Icon>arrow_right</Icon>
        </Button>
      </CardActions>
    </Card>
  );
}
