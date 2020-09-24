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
import {BasicTaskModel} from "../../shared/models/BasicTaskModel";
import {getCurrentHost} from "../../shared/ReactTools";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import {useUserAuthResult} from "../../shared/ReactHooks";
import {useMatStyles} from "../SharedStyles";
import {useTemplateList} from "../TemplatesPage";
import {testItemsValidateIncomplete} from "../../shared/ErrorValidators";

export default function TestListPage({testUrl}: { testUrl: TestUrl }) {
  const {path} = useRouteMatch();
  const classes = useMatStyles();
  const [data, setData] = useState<BasicTaskModel[]>(null);
  const [searchStr, setSearchStr] = useState<string>('');
  const [error, setError] = useState();
  const openSnackbar = useContext(GlobalSnackbar);
  // Authenticate if user has permission to template
  const userAuth = useUserAuthResult('Template');
  const {templates, handleIsTemplateChange, handleTemplateEdit} = useTemplateList(testUrl);
  const openDialog = useContext(GlobalDialog);
  useEffect(() => {
    Axios.get<BasicTaskModel[]>('/api/' + testUrl, {withCredentials: true})
      .then(res => setData(res.data), reason => setError(reason.response.data));
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
  // When trash button clicked. If it is a temple there will be alert
  const handleDelete = (obj: BasicTaskModel) => {
    const openRequest = () => Axios.delete('/api/' + testUrl, {params: {_id: obj._id.$oid}}).then(() => {
      data.splice(data.indexOf(obj), 1);
      setData([...data]);
      openSnackbar('Delete successfully', undefined, 'success');
    });
    if (obj.isTemplate) openDialog('This test is currently being used as a template. Are you sure you want to delete this template?'
      , 'Are you sure?', null, openRequest);
    else openRequest().catch();
  }
  const handleCopyTest = (newTest: BasicTaskModel) => {
    Axios.post<BasicTaskModel>('/api/' + testUrl, {...newTest, name: newTest.name + ' copy'}).then(res => {
      // Give a 0 responseNum and put at the top of the list
      res.data.responseNum = 0;
      // res.data.isTemplate = false;
      data.unshift(res.data);
      setData([...data]);
      openSnackbar('Duplicate successfully', undefined, 'success');
    }, reason => openSnackbar('Something went wrong: ' + reason.response.data));
  }

  return <Grid container spacing={2}>
    <Grid item container xs={12}>
      <Grid item xs={12} md={6}>
        <SearchInput placeholder="Search tests" onChange={e => setSearchStr(e.target.value)}/>
      </Grid>
      <Grid item xs={12} md={6} style={{display: 'flex', alignItems: 'center', paddingTop: 9}}>
        <span style={{flexGrow: 1}}/>
        <AddTestMenu path={path} templates={templates}/>
      </Grid>
    </Grid>
    <Grid item xs={12}>{data ? <Card><CardContent style={{padding: 0}}><Table>
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
          <TableCell><Tooltip title="Check responses">
            <Button to={{pathname: `${path}/${test._id.$oid}`, hash: "#responses"}} component={Link}
                    color="primary">{test.responseNum}</Button>
          </Tooltip></TableCell>
          <TableCell>{new Date(test.createdAt?.$date).toLocaleString()}</TableCell>
          {userAuth && <TableCell>
            <Checkbox color="primary" checked={!!test.isTemplate}
                      onChange={() => handleIsTemplateChange(test)}/>
          </TableCell>}
          <TableCell className={classes.elementGroup}>
            <ActionsGroup testUrl={testUrl} path={path} test={test} onDelete={handleDelete}
                          onCopy={handleCopyTest} handleEdit={handleTemplateEdit}/>
          </TableCell>
        </TableRow>) : <TableRow><TableCell colSpan={4}>
          There is no test here. You can add test by the button top right.
        </TableCell></TableRow>}
      </TableBody>
    </Table></CardContent></Card> : <Loading error={error}/>}</Grid>
  </Grid>
}

/** The menu to add using templates or just a blank page*/
function AddTestMenu({path, templates}: { path: string, templates: BasicTaskModel[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return <>
    <Button color="primary" variant="contained" onClick={handleClick}>Add test</Button>
    <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
      <MenuItem onClick={handleClose} component={Link} to={`${path}/0`}>Blank test</MenuItem>
      {templates && templates.length ? templates.map(temp =>
          <MenuItem key={temp._id.$oid} component={Link}
                    to={{pathname: `${path}/0`, state: temp._id.$oid}}>{temp.name}</MenuItem>)
        : <MenuItem disabled>No template</MenuItem>}
    </Menu>
  </>
}

/** When width is less than md, the button will be put into a menu*/
function ActionsGroup({testUrl, path, test, onDelete, onCopy, handleEdit}: {
  testUrl: TestUrl, path: string, handleEdit: (_: BasicTaskModel) => void,
  test: BasicTaskModel, onDelete: (_: BasicTaskModel) => void, onCopy: (_: BasicTaskModel) => void
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  // Snackbar hooks
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const openDialog = useContext(GlobalDialog);
  const url = `/task/${testUrl}/${test._id.$oid}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleShareClick = () => {
    handleClose();
    // Give a dialog alert that ask if user want to continue. The survey may confuse people.
    const error = testItemsValidateIncomplete(test);
    if (error) openDialog(error, 'Required');
    else navigator.clipboard.writeText(getCurrentHost() + url).then(() => {
      setSnackbarOpen(true);
      window.open(getCurrentHost() + url);
    });
  }
  const handleShareClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  }
  const handleDelete = () => {
    handleClose();
    onDelete(test);
  }
  const handleCopy = () => {
    handleClose();
    onCopy(test);
  }

  return <>
    <Hidden mdDown>
      <Tooltip title="Edit">{test.isTemplate
        ? <IconButton size="small" color="primary" onClick={() => handleEdit(test)}><Icon>edit</Icon></IconButton>
        : <IconButton size="small" color="primary" component={Link}
                      to={`${path}/${test._id.$oid}`}><Icon>edit</Icon></IconButton>
      }</Tooltip>
      <Tooltip title="Open and share this test">
        <IconButton size="small" color="primary" onClick={handleShareClick}><Icon>share</Icon></IconButton>
      </Tooltip>
      <Tooltip title="Duplicate test"><IconButton size="small" color="primary" onClick={() => onCopy(test)}>
        <Icon>content_copy</Icon>
      </IconButton></Tooltip>
      <Tooltip title="Delete"><IconButton size="small" color="default" onClick={() => onDelete(test)}>
        <Icon>delete</Icon>
      </IconButton></Tooltip>
    </Hidden>
    <Hidden lgUp>
      <IconButton size="small" color="primary" onClick={handleClick}><Icon>menu</Icon></IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {test.isTemplate ? <MenuItem onClick={() => handleEdit(test)}>
          <ListItemIcon color="primary"><Icon>edit</Icon></ListItemIcon>
          <ListItemText primary="Edit"/>
        </MenuItem> : <MenuItem component={Link} to={`${path}/${test._id.$oid}`}>
          <ListItemIcon color="primary"><Icon>edit</Icon></ListItemIcon>
          <ListItemText primary="Edit"/>
        </MenuItem>}
        <MenuItem onClick={handleShareClick}>
          <ListItemIcon color="primary"><Icon>share</Icon></ListItemIcon>
          <ListItemText primary="Copy test URL"/>
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <ListItemIcon color="primary"><Icon>content_copy</Icon></ListItemIcon>
          <ListItemText primary="Duplicate"/>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon><Icon>delete</Icon></ListItemIcon>
          <ListItemText primary="Delete"/>
        </MenuItem>
      </Menu>
    </Hidden>
    <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center',}} open={snackbarOpen} autoHideDuration={10_000}
              onClose={handleShareClose} message="Copy the link to clipboard successfully" action={
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleShareClose}>
        <Icon fontSize="small">cancel</Icon>
      </IconButton>
    }/>
  </>
}
