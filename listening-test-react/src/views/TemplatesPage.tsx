import React, {useContext, useEffect, useState} from "react";
import {Box, Checkbox, Tab, Tabs} from "@material-ui/core";
import {TestUrl} from "../shared/models/EnumsAndTypes";
import {BasicTestModel} from "../shared/models/BasicTestModel";
import Axios from "axios";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Card from "@material-ui/core/Card";
import {GlobalSnackbar} from "../shared/ReactContexts";
import Loading from "../layouts/components/Loading";

export default function () {
  const [testUrl, setTestUrl] = useState<TestUrl>('ab-test');

  const handleChange = (event: React.ChangeEvent<any>, newValue: TestUrl) => setTestUrl(newValue);

  return <>
    <Tabs value={testUrl} onChange={handleChange} aria-label="simple tabs example">
      <Tab color="primary" label="AB Test" value='ab-test'/>
      <Tab color="primary" label="Acr Test" value='acr-test'/>
      <Tab color="primary" label="Mushra Test" value='mushra-test'/>
      <Tab color="primary" label="Hearing Sensitivity Test" value='hearing-test'/>
    </Tabs>
    <Box paddingTop={2}>
      {testUrl && <TemplatesList testUrl={testUrl}/>}
    </Box>
  </>
}

function TemplatesList({testUrl}: { testUrl: TestUrl }) {
  const {templates, templatesError, handleIsTemplateChange} = useTemplateList(testUrl);

  return <>{templates ? <Card>
    <CardContent style={{padding: 0}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Creation Date</TableCell>
            <TableCell>Creator</TableCell>
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
          </TableRow>)}
          {!templates.length && <TableRow><TableCell colSpan={3}>
            There is no template here. You can add template by a checkbox on the list of each test.
          </TableCell></TableRow>}
        </TableBody>
      </Table>
    </CardContent>
  </Card> : <Loading error={templatesError}/>}</>
}

export function useTemplateList(testUrl: TestUrl) {
  const openSnackbar = useContext(GlobalSnackbar);
  const [templates, setTemplates] = useState<BasicTestModel[]>();
  const [templatesError, setTemplatesError] = useState();
  useEffect(() => {
    Axios.get('/api/template', {params: {testType: testUrl}}).then(res => setTemplates(res.data),
      reason => setTemplatesError(reason.response.data));
    // Unmount process
    return () => {
      setTemplates(null);
      setTemplatesError(null);
    }
  }, [testUrl]);

  const handleIsTemplateChange = (test: BasicTestModel) =>
    Axios.put<boolean>('/api/template', {_id: test._id}, {params: {testType: testUrl}}).then(res => {
      test.isTemplate = res.data;
      // Append test at the end
      if (test.isTemplate) setTemplates([...templates, test]);
      else {
        // According to oid to delete the template
        templates.splice(templates.findIndex(value => value._id.$oid === test._id.$oid), 1);
        setTemplates([...templates])
      }
    }, reason => openSnackbar('Something went wrong: ' + reason.response.data));

  return {templates, templatesError, handleIsTemplateChange};
}
