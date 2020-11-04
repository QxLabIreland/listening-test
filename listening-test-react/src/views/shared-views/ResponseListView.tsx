import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  createStyles,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  withStyles,
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import Axios from "axios";
import Loading from "../../layouts/components/Loading";
import {downloadFileTool} from "../../shared/UncategorizedTools";
import ResponsePreviewDialog from "./ResponsePreviewDialog";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {red} from "@material-ui/core/colors";

const useStyles = makeStyles((_) => (createStyles({
  content: {padding: 0},
  actions: {display: 'flex', justifyContent: 'space-between', paddingLeft: 0},
  button: {marginLeft: 8,}
})));

const DangerCheckbox = withStyles((_) => ({
  root: {'&$checked': {color: red[500]}},
  checked: null
}))(Checkbox);

export default function ResponseListView(props: { testUrl: TestUrl }) {
  const {testUrl} = props;
  const classes = useStyles();
  // Prefix is the router prefix of a detail
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [responses, setResponse] = useState<any[]>(null);
  const [error, setError] = useState<any>(undefined);
  const {id} = useParams();

  useEffect(() => {
    Axios.get('/api/response', {params: {testType: testUrl, testId: id}})
      .then(res => setResponse(res.data), reason => setError(reason.response.data));
  }, [id, testUrl])

  // Checkbox methods
  const handleSelectAll = (event: any) => {
    currentPageList().forEach(res => res.selected = event.target.checked);
    setResponse([...responses]);
  }
  const handleSelectOne = (event: any, res: any) => {
    res.selected = event.target.checked;
    setResponse([...responses]);
  }
  // Get a list of items for current page
  const currentPageList = (): any[] => responses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // Page handle
  const handlePageChange = (event: any, page: number) => setPage(page);
  const handleRowsPerPageChange = (event: any) => setRowsPerPage(event.target.value);

  // Batch delete checked items
  const handleDelete = () => {
    const deletedList = responses.filter(r => r.selected).map(r => r._id);
    Axios.delete('/api/response', {params: {testType: testUrl, testId: id}, data: deletedList})
      .then(() => setResponse(responses.filter(r => !r.selected)));
  }
  const handleDownload = () => downloadFileTool({
    url: '/api/csv-download/' + testUrl, params: {testId: id}
  });
  const handleDownloadInJSON = () =>
    downloadFileTool({url: '/api/response', params: {testType: testUrl, testId: id, downloadable: true}})

  return (<Grid container spacing={2}>
    <Grid item xs={12}>
      {responses ? <Card>
        <CardContent className={classes.content}><Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Tooltip title="Select all to delete">
                  <DangerCheckbox checked={currentPageList().every(v => v.selected)}
                                  indeterminate={currentPageList().some(v => v.selected) && !currentPageList().every(v => v.selected)}
                                  onChange={handleSelectAll}/>
                </Tooltip>
              </TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageList().length ? currentPageList().map(r => <TableRow hover key={r._id.$oid}>
              <TableCell padding="checkbox">
                <Tooltip title="Select to delete">

                  <DangerCheckbox checked={!!r.selected} onChange={event => handleSelectOne(event, r)}/>
                </Tooltip>
              </TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{new Date(r.createdAt?.$date).toLocaleString()}</TableCell>
              <TableCell>
                <Tooltip title="Preview response">
                  <ResponsePreviewDialog size="small" testUrl={testUrl} taskModel={r}/>
                </Tooltip>
              </TableCell>
            </TableRow>) : <TableRow>
              <TableCell colSpan={4}>There is no response here for this page.</TableCell>
            </TableRow>}
          </TableBody>
        </Table></CardContent>
        <CardActions className={classes.actions}>
          <Tooltip title="Delete selected items">
            <IconButton onClick={handleDelete}><Icon>delete</Icon></IconButton>
          </Tooltip>
          <TablePagination component="div" count={responses.length} onChangePage={handlePageChange}
                           onChangeRowsPerPage={handleRowsPerPageChange} page={page} rowsPerPage={rowsPerPage}
                           rowsPerPageOptions={[10, 25, 50]}/>
        </CardActions>
      </Card> : <Loading error={error}/>}
    </Grid>
    <Grid item xs={12} container justify="flex-end">
      <Tooltip title="Download all Responses in JSON format">
        <Button variant="outlined" color="primary" className={classes.button} onClick={handleDownloadInJSON}>
          <Icon>code</Icon>Download in JSON</Button>
      </Tooltip>
      <Tooltip title="Download all Responses">
        <Button variant="outlined" color="primary" className={classes.button} onClick={handleDownload}>
          <Icon>get_app</Icon>Download in CSV</Button>
      </Tooltip>
      {/*<Button variant="contained" color="primary" className={classes.button}><Icon>get_app</Icon>Download Responses</Button>*/}
    </Grid>
  </Grid>);
};
