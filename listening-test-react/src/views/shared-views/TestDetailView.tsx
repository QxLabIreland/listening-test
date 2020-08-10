import {Prompt, useHistory, useLocation, useParams} from "react-router";
import React, {FunctionComponent, useContext, useEffect, useRef, useState} from "react";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import {useScrollToView} from "../../shared/ReactHooks";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";
import Loading from "../../layouts/components/Loading";
import {TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {BasicTestModel, TestItemModel} from "../../shared/models/BasicTestModel";
import {observer} from "mobx-react";
import {observable} from "mobx";
import TestSettingsDialog from ".//TestSettingsDialog";
import {testItemsValidateError} from "../../shared/ErrorValidators";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {TestDetailItemCardList} from "./TestDetailItemCardList";

export const TestDetailView = observer(function ({testUrl, TestItemExampleCard, ButtonGroup}: {
  testUrl: TestUrl,
  TestItemExampleCard: FunctionComponent<{ example: ItemExampleModel, title: React.ReactNode, action: React.ReactNode, expanded?: boolean }>,
  ButtonGroup: FunctionComponent<{ onAdd: (type: TestItemModel) => void }>
}) {
  const {id} = useParams();
  const [tests, setTests] = useState<BasicTestModel>(null);
  const [isError, setIsError] = useState(false);
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const openSnackbar = useContext(GlobalSnackbar);
  // Scroll properties
  const bottomRef = useRef(null);
  const {scrollToView} = useScrollToView(bottomRef);
  // No submit alert variable
  const [isSubmitted, setIsSubmitted] = useState<boolean>(null);
  const location = useLocation();
  // Request for server methods
  useEffect(() => {
    // If it is edit page, get data from back end
    if (location.state || +id !== 0) Axios.get<BasicTestModel>('/api/' + testUrl, {params: {_id: location.state || id}})
      .then((res) => {
        if (location.state) templateProcess(res.data);
        setTests(observable(res.data));
      }, () => setIsError(true));
    // If in creation page
    else setTests(observable({name: '', description: '', items: []}));
  }, [id, testUrl]);

  const handleSubmit = () => {
    // Validate if all examples have been added audios
    const validationResult = testItemsValidateError(tests);
    if (validationResult) {
      openDialog(validationResult);
      return;
    }
    // Create a new text or modify current test
    if (+id === 0) requestServer(true);
    else Axios.get('/api/response-count', {params: {testId: id, testType: testUrl}}).then(res => {
      // After checking with server, if there are responses, it will create a new test.
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
      method: isNew ? 'POST' : 'PUT', url: '/api/' + testUrl, data: tests
    }).then(() => {
      history.push('./');
      openSnackbar('Save successfully');
    }, reason => openDialog(reason.response.data, 'Something wrong'));
  }
  // Local methods
  const addItem = (newItem: TestItemModel) => {
    tests.items.push(newItem);
    scrollToView();
  }

  // Some components for performance boost
  const NameText = () => <TextField variant="outlined" label="Test Name" fullWidth defaultValue={tests.name} name="name"
                                    onChange={e => tests.name = e.target.value}/>;
  const DesText = () => <TextField variant="outlined" label="Test Description" rowsMax={8} multiline fullWidth
                                   defaultValue={tests.description} name="description"
                                   onChange={(e) => tests.description = e.target.value}/>;
  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Prompt when={!isSubmitted} message={'You have unsaved changes, are you sure you want to leave?'}/>
      {tests ? <React.Fragment>
        <Grid item xs={12} container alignItems="center" spacing={1}>
          <Grid item style={{flexGrow: 1}}/>
          <Grid item><TestSettingsDialog settings={tests.settings}
                                         onConfirm={settings => tests.settings = settings}/></Grid>
          <Grid item><Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button></Grid>
        </Grid>

        <Grid item xs={12}><NameText/></Grid>
        <Grid item xs={12}><DesText/></Grid>
        <TestDetailItemCardList items={tests.items} TestItemExampleCard={TestItemExampleCard}/>
        <Grid item container justify="center" xs={12}>
          <ButtonGroup onAdd={addItem}/>
        </Grid>

        <Grid item xs={12} container alignItems="center" spacing={1} ref={bottomRef}>
          <Grid item style={{flexGrow: 1}}/>
          <Grid item><TestSettingsDialog settings={tests.settings}
                                         onConfirm={settings => tests.settings = settings}/></Grid>
          <Grid item><Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button></Grid>
        </Grid>
      </React.Fragment> : <Grid item><Loading error={isError}/></Grid>}
    </Grid>
  )
})

function templateProcess(tem: BasicTestModel) {
  // Prevent it from becoming a template and some process
  tem.isTemplate = false;
  tem.name = 'Name of template ' + tem.name;
  tem.items.forEach(item => {
    // Remove the links of audios and audioRef
    if (item.type === TestItemType.example || item.type === TestItemType.training) {
      item.example.audios.forEach((_, index) => item.example.audios[index] = null);
      item.example.audioRef = null;
    }
  });
}

