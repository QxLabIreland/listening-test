import React, {useContext, useEffect, useState} from "react";
import {
  Checkbox,
  Grid,
  Hidden,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar
} from "@material-ui/core";
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
import TableBody from "@material-ui/core/TableBody";
import {BasicTestModel} from "../../shared/models/BasicTestModel";
import {getCurrentHost} from "../../shared/ReactTools";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {GlobalSnackbar} from "../../shared/ReactContexts";
import {useUserAuthResult} from "../../shared/ReactHooks";
import {useMatStyles} from "../SharedStyles";
import {useTemplateList} from "../TemplatesPage";

export default function TestListPage({testUrl}: { testUrl: TestUrl }) {
  const {path} = useRouteMatch();
  const classes = useMatStyles();
  const [data, setData] = useState<BasicTestModel[]>(null);
  const [searchStr, setSearchStr] = useState<string>('');
  const [error, setError] = useState();
  const openSnackbar = useContext(GlobalSnackbar);
  // Authenticate if user has permission to template
  const userAuth = useUserAuthResult('Template');
  const {templates, handleIsTemplateChange} = useTemplateList(testUrl);

  useEffect(() => {
    Axios.get<BasicTestModel[]>('/api/' + testUrl, {withCredentials: true}).then((res) => {
      // // Divide templates and nonTemplates
      // const [temp, nonTemp] = res.data.reduce(([pass, fail], elem) =>
      //   elem.isTemplate ? [[...pass, elem], fail] : [pass, [...fail, elem]], [[], []]);
      setData(res.data);
    }, reason => setError(reason.response.data));
    // Reset state
    return () => {
      setData(null);
      setError(undefined);
    }
  }, [testUrl]);

  const getFilterData = () => data.filter(value =>
    // Name searching
    value.name.toLowerCase().includes(searchStr.toLowerCase())
    // Date searching
    || value.createdAt.$date.toString().toLowerCase().includes(searchStr.toLowerCase())
  );
  // When trash button clicked
  const handleDelete = (obj: BasicTestModel) =>
    Axios.delete('/api/' + testUrl, {params: {_id: obj._id.$oid}}).then(() => {
      data.splice(data.indexOf(obj), 1);
      setData([...data]);
      openSnackbar('Delete successfully');
    });
  const handleCopyTest = (newTest: BasicTestModel) => {
    Axios.post<BasicTestModel>('/api/' + testUrl, {...newTest, name: newTest.name + ' copy'}).then(res => {
      data.unshift(res.data);
      setData([...data]);
      openSnackbar('Duplicate successfully');
    }, reason => openSnackbar('Something went wrong: ' + reason.response.data));
  }

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12}>
        <Grid item xs={12} md={6}>
          <SearchInput placeholder="Search tests" onChange={(event: any) => setSearchStr(event.target.value)}/>
        </Grid>
        <Grid item xs={12} md={6} style={{display: 'flex', alignItems: 'center', paddingTop: 9}}>
          <span style={{flexGrow: 1}}/>
          <AddTestMenu path={path} templates={templates}/>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {data ? <Card>
          <CardContent style={{padding: 0}}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Responses</TableCell>
                  {/*<TableCell sortDirection="desc">
                    <Tooltip enterDelay={300} title="Sort">
                      <TableSortLabel active direction="desc">Creation Date</TableSortLabel>
                    </Tooltip>
                  </TableCell>*/}
                  <TableCell>Creation Date</TableCell>
                  {userAuth && <TableCell>Template</TableCell>}
                  <TableCell/>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length ? getFilterData().map(test => <TableRow hover key={test._id.$oid}>
                  <TableCell>{test.name}</TableCell>
                  <TableCell>
                    <Tooltip title="Check responses">

                      <Button to={{pathname: `${path}/${test._id.$oid}`, hash: "#responses"}} component={Link}
                              color="primary">{test.responseNum}</Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {new Date(test.createdAt?.$date).toLocaleString()}
                  </TableCell>
                  {userAuth && <TableCell>
                    <Checkbox checked={!!test.isTemplate} onChange={() => handleIsTemplateChange(test)}/>
                  </TableCell>}
                  <TableCell className={classes.elementGroup}>
                    <ActionsGroup testUrl={testUrl} path={path} test={test} handleDelete={handleDelete}
                                  handleCopyTest={handleCopyTest}/>
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

function ShareIconButton({url, menuItem, ...rest}: any) {
  const [open, setSnackbarOpen] = useState(false);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  const handleShareClick = () => navigator.clipboard.writeText(getCurrentHost() + url)
    .then(() => setSnackbarOpen(true));

  return <>
    {menuItem ? <MenuItem {...rest} onClick={handleShareClick}>
      <ListItemIcon color="primary"><Icon>share</Icon></ListItemIcon>
      <ListItemText primary="Copy test URL" />
    </MenuItem> : <Tooltip title="Copy test URL">
      <IconButton {...rest} size="small" color="primary" onClick={handleShareClick}><Icon>share</Icon></IconButton>
    </Tooltip>}
    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center',}} open={open} autoHideDuration={10_000}
              onClose={handleClose} message="Copy the link to clipboard successfully" action={<>
      <Button size="small" color="secondary" component={Link} target="_blank"
              to={url}>View</Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <Icon fontSize="small">cancel</Icon>
      </IconButton>
    </>}/>
  </>
}

function AddTestMenu({path, templates}: { path: string, templates: BasicTestModel[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return <>
    <Button color="primary" variant="contained" onClick={handleClick}>Add test</Button>
    <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleClose} component={Link} to={`${path}/0`}>Blank test</MenuItem>
      {templates ? templates.map(temp =>
          <MenuItem key={temp._id.$oid} component={Link}
                    to={{pathname: `${path}/0`, state: temp._id.$oid}}>{temp.name}</MenuItem>)
        : <MenuItem disabled>No template</MenuItem>}
    </Menu>
  </>
}

function ActionsGroup(props: { testUrl: TestUrl, path: string, test: BasicTestModel, handleDelete: (_: BasicTestModel) => void, handleCopyTest: (_: BasicTestModel) => void }) {
  const {testUrl, path, test, handleDelete, handleCopyTest} = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return <>
    <Hidden mdDown>
      <Tooltip title="Edit">
        <IconButton size="small" color="primary" component={Link}
                    to={`${path}/${test._id.$oid}`}><Icon>edit</Icon></IconButton>
      </Tooltip>
      <ShareIconButton url={`/task/${testUrl}/${test._id.$oid}`}/>
      <Tooltip title="Duplicate test">
        <IconButton size="small" color="primary"
                    onClick={() => handleCopyTest(test)}><Icon>content_copy</Icon></IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton size="small" color="default"
                    onClick={() => handleDelete(test)}><Icon>delete</Icon></IconButton>
      </Tooltip>
    </Hidden>
    <Hidden lgUp>
      <IconButton size="small" color="primary" onClick={handleClick}><Icon>menu</Icon></IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem component={Link} to={`${path}/${test._id.$oid}`}>
          <ListItemIcon color="primary"><Icon>edit</Icon></ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
        <ShareIconButton url={`/task/${testUrl}/${test._id.$oid}`} menuItem/>
        <MenuItem onClick={() => {handleCopyTest(test);handleClose();}}>
          <ListItemIcon color="primary"><Icon>content_copy</Icon></ListItemIcon>
          <ListItemText primary="Duplicate" />
        </MenuItem>
        <MenuItem onClick={() => {handleDelete(test);handleClose();}}>
          <ListItemIcon><Icon>delete</Icon></ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </Hidden>
  </>
}
