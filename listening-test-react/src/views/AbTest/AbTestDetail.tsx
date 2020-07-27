import React, {useContext, useEffect, useRef, useState} from "react";
import {Prompt, useHistory, useParams} from 'react-router';
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import {Box, CardContent, FormControlLabel, Switch, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {observable} from "mobx";
import {observer} from "mobx-react";
import CardHeader from "@material-ui/core/CardHeader";
import {SurveySetUpView} from "./SurveySetUpView";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../layouts/components/Loading";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import {TagsGroup} from "../../shared/components/TagsGroup";
import {useScrollToView} from "../../shared/ReactHooks";
import {SurveyControl} from "../../shared/components/SurveyControl";
import {SurveyControlType, TestItemType} from "../../shared/models/EnumsAndTypes";
import TestSettingsDialog from "../shared-views/TestSettingsDialog";
import {ExampleSettingsDialog} from "../shared-views/ExampleSettingsDialog";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import DraggableZone from "../../shared/components/DraggableZone";
import {uuid} from "uuidv4";
import {ValidateDetailError} from "../../shared/ReactTools";

export const AbTestDetail = observer(function () {
  const {id} = useParams();
  const [tests, setTests] = useState<AbTestModel>(null);
  const [isError, setIsError] = useState(false);
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const openSnackbar = useContext(GlobalSnackbar);
  // Scroll properties
  const viewRef = useRef(null);
  const {scrollToView} = useScrollToView(viewRef);
  // No submit alert variable
  const [isSubmitted, setIsSubmitted] = useState<boolean>(null);

  useEffect(() => {
    // If it is edit page, get data from back end
    if (+id !== 0) Axios.get<AbTestModel>('/api/ab-test', {params: {_id: id}})
      // Successful callback
      .then((res) => setTests(observable(res.data)),
        () => setIsError(true));
    // If in creation page
    else setTests(observable({name: '', description: '', examples: [], survey: [], items: undefined}));
  }, [id]);

  function addExample() {
    if (!tests.items) tests.items = [];
    tests.items.push({id: uuid(), type: TestItemType.example, example: {
        fields: [
          {type: SurveyControlType.radio, question: 'Which one is your preference?', options: ['A', 'B'], value: null, required: true},
          {type: SurveyControlType.text, question: 'Briefly comment on your choice.', value: null, required: true}
        ],
        audios: [null, null]
      }});
    scrollToView();
  }

  function deleteExample(index: number) {
    tests.items.splice(index, 1);
  }

  const handleSubmit = () => {
    // Validate if all examples have been added audios
    const validationResult = ValidateDetailError(tests);
    if (validationResult) {
      openDialog(validationResult);
      return;
    }
    if (+id === 0) {
      requestServer(true);
    } else Axios.get('/api/response-count', {params: {testId: id, testType: 'ab-test'}}).then(res => {
      // After checking with server, if there are responses
      if (res.data > 0) openDialog(
        'This test already has some responses, save will create a new test. You can delete old one if you like.',
        'Reminder', null, () => requestServer(true));
      else requestServer(false);
    });
  }

  const requestServer = (isNew: boolean) => {
    setIsSubmitted(true);
    // Request server based on is New or not.
    Axios.request({
      method: isNew ? 'POST' : 'PUT', url: '/api/ab-test', data: tests
    }).then(() => {
      openSnackbar('Save Successfully');
      history.push('./');
    }, reason => openDialog(reason.response.data, 'Something wrong'));
  }

  const handleReorder = (index: number, newIndex: number) => {
    const value = tests.items.splice(index, 1);
    // Insert and delete original
    tests.items.splice(newIndex, 0, ...value);
  }

  const ActionsArea = () => <Grid item xs={12} container alignItems="center" justify="flex-end" spacing={1}>
    <Grid item><TestSettingsDialog settings={tests.settings} onConfirm={settings => tests.settings = settings}/></Grid>
    <Grid item><Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button></Grid>
  </Grid>

  return <Grid container spacing={2} justify="center" alignItems="center">
    <Prompt when={!isSubmitted}
            message='You have unsaved changes, are you sure you want to leave?'/>
    {tests ? <React.Fragment>
      <ActionsArea/>

      <Grid item xs={12}>
        <TextField variant="outlined" value={tests.name} onChange={(e) => tests.name = e.target.value}
                   label="Test Name" fullWidth/>
      </Grid>
      <Grid item xs={12}>
        <TextField variant="outlined" label="Test Description" rowsMax={8} value={tests.description}
                   onChange={(e) => tests.description = e.target.value} multiline fullWidth/>
      </Grid>
      <Grid item xs={12}><SurveySetUpView items={tests.survey}/></Grid>

      {tests.items?.map((v, i) =>
        <Grid item xs={12} key={i} ref={viewRef}>
          <DraggableZone index={i} length={tests.items.length} onReorder={handleReorder}>
            <AbTestExCard v={v.example} i={i} deleteExample={deleteExample}/>
          </DraggableZone>
        </Grid>
      )}
      <Grid item container justify="center" xs={12}>
        <Button variant="outlined" color="primary" onClick={addExample}>
          <Icon>add</Icon>Add Example
        </Button>
      </Grid>

      <ActionsArea/>
    </React.Fragment> : <Grid item><Loading error={isError}/></Grid>}
  </Grid>
})

const AbTestExCard = observer(function ({v, i, deleteExample}: {v: ItemExampleModel, i: number, deleteExample: (i: number)=> void}) {
  return <Card>
    <CardHeader title={<div style={{display: 'flex'}}>
      <span>Example {i + 1}</span>
      <TagsGroup value={v.tags} onChange={newTags => v.tags = newTags}/>
    </div>} action={<>
      {/*<ExampleSettingsDialog settings={v.settings} onConfirm={settings => v.settings = settings}/>*/}
      <IconButton onClick={() => deleteExample(i)}><Icon>delete</Icon></IconButton>
    </>}/>
    <CardContent>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <FileDropZone fileModel={v.audios[0]} onChange={fm => v.audios[0] = fm}/>
        </Grid>
        <Grid item xs={12} md={5}>
          <FileDropZone fileModel={v.audios[1]} onChange={fm => v.audios[1] = fm}/>
        </Grid>
        <Grid item xs={12} md={2}>
          <FileDropZone fileModel={v.audioRef} onChange={fm => v.audioRef = fm}
                        label="Reference (Optional)"/></Grid>
        {v.fields?.map((q, qi) => <Grid item xs={12} key={qi}>
          <Box style={{display: 'flex', justifyContent: 'flex-end'}}>
            <FormControlLabel label="Required" control={
              <Switch checked={q.required} onChange={e => q.required = e.target.checked}/>
            }/>
          </Box>
          <SurveyControl control={q} label={'Your question ' + (qi + 1)}/>
        </Grid>)}
      </Grid>
    </CardContent>
  </Card>
})
