import Axios from 'axios';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Box, Checkbox, Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';

import { globalStore } from '../../global/globalStore';
import Loading from '../../shared/components/Loading';
import SearchInput from '../../shared/components/SearchInput';
import { AppPermissions } from '../../shared/enums/permissions';
import { TestUrl, URL_TO_TITLE } from '../../shared/enums/test-urls';
import { BasicTaskModel } from '../../shared/models/BasicTaskModel';
import { formatDate } from '../../shared/tools/dateUtils';
import { useUserAuthResult } from '../AppBarDrawer/AuthRoute';
import { useTemplateList } from '../general/TemplatesPage';
import AddTestMenu from './AddTestMenu';
import TestListActions from './TestListActions';
import { tasksStore } from './task-list-store';

export default observer(function TestListPage({ testUrl }: { testUrl: TestUrl }) {
  // Authenticate if user has permission to template
  const userAuth = useUserAuthResult(AppPermissions.Template);
  const { templates, handleIsTemplateChange, handleTemplateEdit } = useTemplateList(testUrl);

  useEffect(() => {
    globalStore.setAppBarTitle(URL_TO_TITLE[testUrl]);
    Axios.get<BasicTaskModel[]>('/api/' + testUrl, { withCredentials: true }).then(
      ({ data }) => tasksStore.setData(data),
      tasksStore.setError,
    );
    return tasksStore.reset;
  }, [testUrl]);

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <SearchInput placeholder="Search tests" onChange={e => tasksStore.setSearchStr(e.target.value)} />
        </Grid>
        <Grid item xs={6} display="flex" alignItems="end">
          <Box flexGrow={1} />
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
                        <TableCell>{formatDate(taskModel.createdAt?.$date)}</TableCell>
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
                          <TestListActions testUrl={testUrl} task={taskModel} handleEdit={handleTemplateEdit} />
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
