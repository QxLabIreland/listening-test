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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router-dom";
import Axios from "axios";
import Loading from "../../layouts/components/Loading";
import {downloadFileTool} from "../../shared/ReactTools";
import ResponsePreviewDialog from "./ResponsePreviewDialog";
import {AbSurveyPage} from "../AbTest/AbSurveyPage";
import {BasicTestModel} from "../../shared/models/BasicTestModel";
import {AbTestModel} from "../../shared/models/AbTestModel";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {SurveyPage} from "./SurveyPage";

const useStyles = makeStyles(() => (createStyles({
  content: {
    padding: 0
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginLeft: 8,
  }
})));

export default function ResponseListView(props: {testUrl: TestUrl}) {
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
  // Switch to the correct rendering view
  const renderSurveyPage = (value: BasicTestModel) => {
    switch (testUrl) {
      case "ab-test": return <AbSurveyPage value={value as AbTestModel}/>
      case "acr-test":
      case "mushra-test":
      case "hearing-test": return <SurveyPage testUrl={testUrl} value={value}/>
      default: return null;
    }
  }
  return (<Grid container spacing={2}>
    <Grid item xs={12}>
      {responses ? <Card>
        <CardContent className={classes.content}><Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={currentPageList().every(v => v.selected)} color="primary"
                          indeterminate={currentPageList().some(v => v.selected) && !currentPageList().every(v => v.selected)}
                          onChange={handleSelectAll}/>
              </TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Submitted At</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageList().length ? currentPageList().map(r => <TableRow hover key={r._id.$oid}>
              <TableCell padding="checkbox">
                <Checkbox checked={!!r.selected} color="primary" onChange={event => handleSelectOne(event, r)}/>
              </TableCell>
              <TableCell>{r.name}</TableCell>
              <TableCell>{new Date(r.createdAt?.$date).toLocaleString()}</TableCell>
              <TableCell>
                <ResponsePreviewDialog>{renderSurveyPage(r)}</ResponsePreviewDialog>
              </TableCell>
            </TableRow>) :<TableRow>
              <TableCell colSpan={4}>There is no response here for this page.</TableCell>
            </TableRow>}
          </TableBody>
        </Table></CardContent>
        <CardActions className={classes.actions}>
          <TablePagination component="div" count={responses.length} onChangePage={handlePageChange}
                           onChangeRowsPerPage={handleRowsPerPageChange} page={page} rowsPerPage={rowsPerPage}
                           rowsPerPageOptions={[10, 25, 50]}/>
        </CardActions>
      </Card> : <Loading error={!!error} message={error}/>}
    </Grid>
    <Grid item xs={12} className={classes.actions}>
      <Tooltip title="Download all Responses for This Test">
        <Button variant="outlined" color="primary" onClick={handleDownload}>
          <Icon>get_app</Icon>Download all Responses</Button>
      </Tooltip>
      <Button variant="outlined" className={classes.button} onClick={handleDelete}><Icon>delete</Icon>Delete Selected</Button>
      {/*<Button variant="contained" color="primary" className={classes.button}><Icon>get_app</Icon>Download Responses</Button>*/}
    </Grid>
  </Grid>);
};
