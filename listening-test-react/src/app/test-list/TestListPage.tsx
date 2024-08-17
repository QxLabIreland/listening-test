import Axios from 'axios';
import { observer } from 'mobx-react';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Checkbox,
  Grid,
  Hidden,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Snackbar,
} from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import SearchInput from '../../components/utils/SearchInput';
import { globalStore } from '../../global/globalStore';
import { GlobalDialog } from '../../shared/ReactContexts';
import Loading from '../../shared/components/Loading';
import { AppPermissions } from '../../shared/enums/permissions';
import { TestUrl } from '../../shared/enums/test-urls';
import { AudioExampleModel } from '../../shared/models/AudioTestModel';
import { BasicTaskModel } from '../../shared/models/BasicTaskModel';
import { useUserAuthResult } from '../AppBarDrawer/AuthRoute';
import { useTemplateList } from '../general/TemplatesPage';
import { tasksStore } from '../task-list-store';
import { DeleteButtonAndDialog } from './DeleteButtonAndDialog';
import { ShareLinkDialog } from './ShareLinkDialog';

export default observer(function TestListPage({ testUrl }: { testUrl: TestUrl }) {
  // Authenticate if user has permission to template
  const userAuth = useUserAuthResult(AppPermissions.Template);
  const { templates, handleIsTemplateChange, handleTemplateEdit } = useTemplateList(testUrl);
  const openDialog = useContext(GlobalDialog);
  useEffect(() => {
    Axios.get<BasicTaskModel[]>('/api/' + testUrl, { withCredentials: true }).then(
      ({ data }) => tasksStore.setData(data),
      tasksStore.setError,
    );
    // Reset state
    return tasksStore.reset;
  }, [testUrl]);

  // When trash button clicked. If it is a temple there will be alert
  const handleDelete = (obj: BasicTaskModel) => {
    const openRequest = () =>
      Axios.delete('/api/' + testUrl, { params: { _id: obj._id.$oid } }).then(() => {
        tasksStore.delete(obj);
        globalStore.showSnackbar('Delete successfully', undefined, 'success');
      });
    if (obj.isTemplate)
      openDialog(
        'This test is currently being used as a template. Are you sure you want to delete this template?',
        'Are you sure?',
        null,
        openRequest,
      );
    else openRequest().catch();
  };
  const handleCopyTest = (oldTest: BasicTaskModel) => {
    // Compatible fix for previous bug, delete the value that set in preview mode.
    oldTest.items.forEach(value => {
      if (value.questionControl?.value) value.questionControl.value = undefined;
      if (value.example?.hasOwnProperty('playedOnce')) delete (value.example as AudioExampleModel).playedOnce;
      if (value.example?.fields) value.example.fields.forEach(value1 => (value1.value = undefined));
    });
    Axios.post<BasicTaskModel>('/api/' + testUrl, { ...oldTest, name: oldTest.name + ' copy' }).then(
      ({ data }) => {
        // Give a 0 responseNum and put at the top of the list
        data.responseNum = 0;
        tasksStore.unshift(data);
        globalStore.showSnackbar('Duplicate successfully', undefined, 'success');
      },
      reason => globalStore.showSnackbar('Something went wrong: ' + reason.response.data),
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12}>
        <Grid item xs={12} md={6}>
          <SearchInput placeholder="Search tests" onChange={e => tasksStore.setSearchStr(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={6} style={{ display: 'flex', alignItems: 'center', paddingTop: 9 }}>
          <span style={{ flexGrow: 1 }} />
          <AddTestMenu templates={templates} />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {tasksStore.data ? (
          <Card>
            <CardContent style={{ padding: 0 }}>
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
                    <TableCell>Created At</TableCell>
                    {userAuth && <TableCell>Template</TableCell>}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasksStore.data.length ? (
                    tasksStore.filteredData.map(taskModel => (
                      <TableRow hover key={taskModel._id.$oid}>
                        <TableCell>{taskModel.name}</TableCell>
                        <TableCell>
                          <Tooltip title="Check responses">
                            <Button
                              to={{ pathname: taskModel._id.$oid, hash: '#responses' }}
                              component={Link}
                              color="primary">
                              {taskModel.responseNum}
                            </Button>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{new Date(taskModel.createdAt?.$date).toLocaleString()}</TableCell>
                        {userAuth && (
                          <TableCell>
                            <Checkbox
                              color="primary"
                              checked={!!taskModel.isTemplate}
                              onChange={() => handleIsTemplateChange(taskModel)}
                            />
                          </TableCell>
                        )}
                        <TableCell sx={theme => ({ whiteSpace: 'nowrap', '& > *': { margin: theme.spacing(0.5) } })}>
                          <ActionsGroup
                            testUrl={testUrl}
                            taskModel={taskModel}
                            onDelete={handleDelete}
                            onCopy={handleCopyTest}
                            handleEdit={handleTemplateEdit}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4}>
                        There is no test here. You can add test by the button top right.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Loading error={tasksStore.error?.message} />
        )}
      </Grid>
    </Grid>
  );
});

/** The menu to add using templates or just a blank page*/
function AddTestMenu({ templates }: { templates: BasicTaskModel[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button color="primary" variant="contained" onClick={handleClick}>
        Add test
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="0">
          Blank test
        </MenuItem>
        {templates && templates.length ? (
          templates.map(temp => (
            <MenuItem key={temp._id.$oid} component={Link} to="0" state={temp._id.$oid}>
              {temp.name}
            </MenuItem>
          ))
        ) : (
          <ListSubheader>No template</ListSubheader>
        )}
      </Menu>
    </>
  );
}

/** When width is less than md, the button will be put into a menu*/
function ActionsGroup({
  testUrl,
  taskModel,
  onDelete,
  onCopy,
  handleEdit,
}: {
  testUrl: TestUrl;
  handleEdit: (_: BasicTaskModel) => void;
  taskModel: BasicTaskModel;
  onDelete: (_: BasicTaskModel) => void;
  onCopy: (_: BasicTaskModel) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  // Snackbar hooks
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const shareDialogState = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleShareClose = (_: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };
  const handleDelete = () => {
    handleClose();
    onDelete(taskModel);
  };
  const handleCopy = () => {
    handleClose();
    onCopy(taskModel);
  };

  return (
    <>
      <ShareLinkDialog taskUrl={testUrl} task={taskModel} shareDialogState={shareDialogState} />
      <Hidden mdDown>
        <Tooltip title="Share this test">
          <IconButton color="primary" size="small" onClick={() => shareDialogState[1](true)}>
            <Icon>share</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          {taskModel.isTemplate ? (
            <IconButton size="small" color="primary" onClick={() => handleEdit(taskModel)}>
              <Icon>edit</Icon>
            </IconButton>
          ) : (
            <IconButton size="small" color="primary" component={Link} to={taskModel._id.$oid}>
              <Icon>edit</Icon>
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title="Duplicate test">
          <IconButton size="small" color="primary" onClick={() => onCopy(taskModel)}>
            <Icon>content_copy</Icon>
          </IconButton>
        </Tooltip>
        <DeleteButtonAndDialog onDelete={() => onDelete(taskModel)} />
      </Hidden>
      <Hidden lgUp>
        <IconButton size="small" color="primary" onClick={handleClick}>
          <Icon>menu</Icon>
        </IconButton>
        <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={() => shareDialogState[1](true)}>
            <ListItemIcon color="primary">
              <Icon>share</Icon>
            </ListItemIcon>
            <ListItemText primary="Share task URL" />
          </MenuItem>
          {taskModel.isTemplate ? (
            <MenuItem onClick={() => handleEdit(taskModel)}>
              <ListItemIcon color="primary">
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
          ) : (
            <MenuItem component={Link} to={taskModel._id.$oid}>
              <ListItemIcon color="primary">
                <Icon>edit</Icon>
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </MenuItem>
          )}
          <MenuItem onClick={handleCopy}>
            <ListItemIcon color="primary">
              <Icon>content_copy</Icon>
            </ListItemIcon>
            <ListItemText primary="Duplicate" />
          </MenuItem>
          <DeleteButtonAndDialog onDelete={handleDelete} menu />
        </Menu>
      </Hidden>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={10_000}
        onClose={handleShareClose}
        message="Copy the link to clipboard successfully"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleShareClose}>
            <Icon fontSize="small">cancel</Icon>
          </IconButton>
        }
      />
    </>
  );
}
