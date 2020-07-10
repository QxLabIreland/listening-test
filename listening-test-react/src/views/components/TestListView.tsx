import React, {useEffect, useState} from "react";
import {Grid, Icon, IconButton, Snackbar} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import SearchInput from "../../shared/components/SearchInput";
import {useRouteMatch} from "react-router";
import Axios from "axios";
import Loading from "../../layouts/components/Loading";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableBody from "@material-ui/core/TableBody";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {BasicTestModel} from "../../shared/models/BasicTestModel";
import {getCurrentHost} from "../../shared/ReactTools";
import {TestUrl} from "../../shared/ReactEnumsAndTypes";

const useStyles = makeStyles((theme: Theme) => createStyles({
  content: {
    padding: 0
  },
  button: {
    marginRight: theme.spacing(1)
  }
}));

export default function TestListView(props: { testUrl: TestUrl }) {
  const {testUrl} = props;
  const {path} = useRouteMatch();
  const classes = useStyles();
  const [data, setData] = useState<BasicTestModel[]>(null);
  const [filtered, setFiltered] = useState<BasicTestModel[]>(null);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    Axios.get<BasicTestModel[]>('/api/' + testUrl, {withCredentials: true})
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
      }, reason => setError(reason.response.data));

    // Reset state
    return () => {
      setData(null);
      setFiltered(null);
      setError(undefined);
    }
  }, [testUrl]);

  const handleSearchChange = (event) =>
    setFiltered(data.filter(value =>
      // Name searching
      value.name.toLowerCase().includes(event.target.value.toLowerCase())
      // Date searching
      || value.createdAt.$date.toString().toLowerCase().includes(event.target.value.toLowerCase())
    ));

  // When trash button clicked
  const handleDelete = (obj: BasicTestModel) =>
    Axios.delete('/api/' + testUrl, {params: {_id: obj._id.$oid}}).then(() => {
      data.splice(data.indexOf(obj), 1);
      setData([...data]);
    });

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12}>
        <Grid item xs={12} md={6}>
          <SearchInput placeholder="Search tests" onChange={handleSearchChange}/>
        </Grid>
        <Grid item xs={12} md={6} style={{display: 'flex', alignItems: 'center', paddingTop: 9}}>
          <span style={{flexGrow: 1}}/>
          <Button color="primary" variant="contained" component={Link} to={`${path}/0`}>
            Add test
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {filtered ? <Card>
          <CardContent className={classes.content}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Responses</TableCell>
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
                {filtered.length ? filtered.map(test => <TableRow hover key={test._id.$oid}>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>
                    <Button to={{pathname: `${path}/${test._id.$oid}`, hash: "#responses"}} component={Link}
                            color="primary">{test.responses?.length}</Button>
                  </TableCell>
                  <TableCell>
                    {new Date(test.createdAt?.$date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton className={classes.button} size="small" color="primary" component={Link}
                                to={`${path}/${test._id.$oid}`}><Icon>edit</Icon></IconButton>
                    <ShareIconButton className={classes.button} url={`/task/${testUrl}/${test._id.$oid}`}/>
                    <IconButton className={classes.button} size="small" color="default"
                                onClick={() => handleDelete(test)}>
                      <Icon>delete</Icon></IconButton>
                  </TableCell>
                </TableRow>) : <TableRow><TableCell colSpan={4}>
                  There is no test here. You can add test by the button top right.
                </TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card> : <Loading error={!!error} message={error}/>}
      </Grid>

    </Grid>
  )
}

function ShareIconButton(props) {
  const {url, ...rest} = props;
  const [open, setSnackbarOpen] = useState(false);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false);
  };
  const handleShareClick = () => {
    navigator.clipboard.writeText(getCurrentHost() + url)
      .then(() => setSnackbarOpen(true));
  }

  return (
    <React.Fragment>
      <IconButton {...rest} size="small" color="primary"
                  onClick={handleShareClick}><Icon>share</Icon></IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={10_000}
        onClose={handleClose}
        message="Copy the link to clipboard successfully"
        action={
          <React.Fragment>
            <Button size="small" color="secondary" component={Link}
                    to={url}>View</Button>

            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <Icon fontSize="small">cancel</Icon>
            </IconButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}
