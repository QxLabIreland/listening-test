import React, {useContext, useEffect, useState} from "react";
import {Box, Checkbox, Icon, IconButton, Tab, Tabs} from "@material-ui/core";
import {TestUrl} from "../shared/models/EnumsAndTypes";
import Axios from "axios";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Card from "@material-ui/core/Card";
import {CurrentUser, GlobalDialog, GlobalSnackbar} from "../shared/ReactContexts";
import Loading from "../layouts/components/Loading";
import {useHistory} from "react-router";
import Tooltip from "@material-ui/core/Tooltip";
import {BasicTaskModel} from "../shared/models/BasicTaskModel";

export default function () {
  // Change Test URL and the active tab will change
  const [testUrl, setTestUrl] = useState<TestUrl>('ab-test');

  const handleChange = (event: React.ChangeEvent<any>, newValue: TestUrl) => setTestUrl(newValue);

  return <>
    <Tabs value={testUrl} onChange={handleChange} indicatorColor="primary" aria-label="simple tabs example">
      <Tab label="AB Test" value='ab-test'/>
      <Tab label="Acr Test" value='acr-test'/>
      <Tab label="Mushra Test" value='mushra-test'/>
      <Tab label="Hearing Sensitivity Test" value='hearing-test'/>
    </Tabs>
    <Box paddingTop={2}>
      {testUrl && <TemplatesList testUrl={testUrl}/>}
    </Box>
  </>
}

function TemplatesList({testUrl}: { testUrl: TestUrl }) {
  const {templates, templatesError, handleIsTemplateChange, handleTemplateEdit} = useTemplateList(testUrl);
  const {currentUser} = useContext(CurrentUser);

  return <>{templates ? <Card><CardContent style={{padding: 0}}><Table>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Created At</TableCell>
        <TableCell>Creator</TableCell>
        <TableCell>Template</TableCell>
        <TableCell/>
      </TableRow>
    </TableHead>
    <TableBody>
      {templates.map(test => <TableRow hover key={test._id.$oid}>
        <TableCell>{test.name}</TableCell>
        <TableCell>{new Date(test.createdAt?.$date).toLocaleString()}</TableCell>
        <TableCell>{test.creator.name}</TableCell>
        <TableCell>
          <Checkbox color="primary" checked={!!test.isTemplate} onChange={() => handleIsTemplateChange(test)}/>
        </TableCell>
        <TableCell>
          {currentUser._id.$oid === test.creator._id.$oid && <Tooltip title="Edit Template">
            <IconButton size="medium" color="primary"
                        onClick={() => handleTemplateEdit(test)}><Icon>edit</Icon></IconButton>
          </Tooltip>}
        </TableCell>
      </TableRow>)}
      {!templates.length && <TableRow><TableCell colSpan={3}>
        There is no template here. You can add template by a checkbox on the list of each test.
      </TableCell></TableRow>}
    </TableBody>
  </Table></CardContent></Card> : <Loading error={templatesError}/>}</>
}

/** This hook is reusable. There are two place using this hook: TemplatesList and TestListPage */
export function useTemplateList(testUrl: TestUrl) {
  const openSnackbar = useContext(GlobalSnackbar);
  const [templates, setTemplates] = useState<BasicTaskModel[]>();
  const [templatesError, setTemplatesError] = useState();
  const openDialog = useContext(GlobalDialog);
  const history = useHistory();

  useEffect(() => {
    Axios.get('/api/template', {params: {testType: testUrl}}).then(res => setTemplates(res.data),
      reason => setTemplatesError(reason.response.data));
    // Unmount process to make sure data in current tab will change
    return () => {
      setTemplates(null);
      setTemplatesError(null);
    }
  }, [testUrl]);

  const handleIsTemplateChange = (test: BasicTaskModel) => {
    // Create a request method for reusing purpose
    const openRequest = () => Axios.put<boolean>('/api/template', {_id: test._id}, {params: {testType: testUrl}}).then(res => {
      test.isTemplate = res.data;
      // Append test at the end
      if (test.isTemplate) setTemplates([...templates, test]);
      else {
        // According to oid to delete the template
        templates.splice(templates.findIndex(value => value._id.$oid === test._id.$oid), 1);
        setTemplates([...templates])
      }
    }, reason => openSnackbar('Something went wrong: ' + reason.response.data));
    // If it is a template, the dialog will be opened for warning
    if (test.isTemplate) openDialog(
      'This test is currently being used as a template. Are you sure you want to remove this from templates?',
      'Are you sure?', null, openRequest
    ); else openRequest().catch();
  }
  const handleTemplateEdit = (aTest: BasicTaskModel) => {
    // If it is a template, the dialog will be opened for warning
    if (aTest.isTemplate) openDialog(
      'This test is currently being used as a template. Are you sure you want to edit this template?'
      , 'Are you sure?', null, () => history.push(`/user/${testUrl}/${aTest._id.$oid}`)
    ); else history.push(`/user/${testUrl}/${aTest._id.$oid}`);
  }

  return {templates, templatesError, handleIsTemplateChange, handleTemplateEdit};
}
