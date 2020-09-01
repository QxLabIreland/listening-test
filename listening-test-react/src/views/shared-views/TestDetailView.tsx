import {Prompt, useHistory, useLocation, useParams} from "react-router";
import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Checkbox, FormControlLabel, TextField} from "@material-ui/core";
import Loading from "../../layouts/components/Loading";
import {TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {BasicTestModel, TestItemModel} from "../../shared/models/BasicTestModel";
import {observer} from "mobx-react";
import {observable} from "mobx";
import TestSettingsDialog from ".//TestSettingsDialog";
import {ItemExampleModel} from "../../shared/models/ItemExampleModel";
import {TestDetailItemCardList} from "./TestDetailItemCardList";
import {deepObserve} from "mobx-utils";

export const TestDetailView = observer(function ({testUrl, TestItemExampleCard, ButtonGroup}: {
  testUrl: TestUrl,
  TestItemExampleCard: FunctionComponent<{ example: ItemExampleModel, title: React.ReactNode, action: React.ReactNode, expanded?: boolean }>,
  ButtonGroup: FunctionComponent<{ onAdd: (type: TestItemModel) => void }>
}) {
  const {id} = useParams();
  const [testModel, setTestModel] = useState<BasicTestModel>(null);
  const [loadingError, setLoadingError] = useState<string>();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const openSnackbar = useContext(GlobalSnackbar);
  // No submit alert variable
  const [isTestChanged, setIsTestChanged] = useState<boolean>(false);
  const location = useLocation();
  // Request for server methods
  useEffect(() => {
    // If it is edit page, get data from back end. If there is value in location.state, we gonna use a template
    if (location.state || +id !== 0) Axios.get<BasicTestModel>('/api/' + testUrl, {params: {_id: location.state || id}})
      .then((res) => {
        if (location.state) templateProcess(res.data, testUrl);
        const observableTest = addAnObserveForChanges(res.data);
        setTestModel(observableTest);
      }, res => setLoadingError(res.response.data));
    // If in creation page
    else {
      const data = {name: '', description: '', items: [] as TestItemModel[]};
      const observable = addAnObserveForChanges(data);
      setTestModel(observable);
    }
  }, [id, testUrl, location.state]);

  const addAnObserveForChanges = (data: BasicTestModel) => {
    /** Stringify the data for unsaved modification detection */
    const theTestStr = JSON.stringify(data);
    const anObservable = observable(data);
    // Add an observe to set if is data changed
    deepObserve(anObservable, (newValue) => {
      setIsTestChanged(JSON.stringify(newValue.object) !== theTestStr);
    });
    return anObservable;
  }
  const handleSubmit = () => {
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
    setIsTestChanged(false);
    // Request server based on is New or not.
    Axios.request({
      method: isNew ? 'POST' : 'PUT', url: '/api/' + testUrl, data: testModel
    }).then(() => {
      history.push('./');
      openSnackbar('Save successfully', undefined, 'success');
    }, reason => openDialog(reason.response.data, 'Something wrong'));
  }
  // Local methods
  const addItem = (newItem: TestItemModel) => testModel.items.push(newItem)

  // Extract those components, they won't be update when onChange, because they are uncontrolled
  // const NameText = () => <TextField variant="outlined" label="Test Name" fullWidth defaultValue={testModel.name} name="name"
  //                                   onChange={e => testModel.name = e.target.value}/>;
  // const DesText = () => <TextField variant="outlined" label="Test Description" rowsMax={8} multiline fullWidth
  //                                  defaultValue={testModel.description} name="description"
  //                                  onChange={(e) => testModel.description = e.target.value}/>;
  const actions = !!testModel && <Grid item xs={12} container alignItems="center" spacing={1}>
    <Grid item style={{flexGrow: 1}}/>
    <Grid item><FormControlLabel label="Collapse All" control={
      <Checkbox color="primary" checked={testModel.items.every(v => v.collapsed)}
                indeterminate={testModel.items.some(v => v.collapsed) && !testModel.items.every(v => v.collapsed)}
                onChange={e => testModel.items.forEach(v => v.collapsed = e.target.checked)}/>
    }/></Grid>
    <Grid item><TestSettingsDialog settings={testModel.settings}
                                   onConfirm={settings => testModel.settings = settings}/></Grid>
    <Grid item><Button color="primary" variant="contained" onClick={handleSubmit} disabled={!isTestChanged}>Save{!isTestChanged && 'd'}</Button></Grid>
  </Grid>
  return (
    <Grid container spacing={2} justify="center" alignItems="center" id='containerTestDetailItemCardList'>
      <Prompt when={isTestChanged} message={'You have unsaved changes, are you sure you want to leave?'}/>
      {testModel ? <React.Fragment>
        {actions}
        <Grid item xs={12}>
          <TextField variant="outlined" label="Test Name" fullWidth defaultValue={testModel.name} name="name"
                     onChange={e => testModel.name = e.target.value}/>
        </Grid>
        <Grid item xs={12}>
          <TextField variant="outlined" label="Test Description" rowsMax={8} multiline fullWidth
                     defaultValue={testModel.description} name="description"
                     onChange={(e) => testModel.description = e.target.value}/>
        </Grid>
        <TestDetailItemCardList items={testModel.items} TestItemExampleCard={TestItemExampleCard}/>
        <Grid item container justify="center" xs={12}>
          <ButtonGroup onAdd={addItem}/>
        </Grid>
        {actions}
      </React.Fragment> : <Grid item><Loading error={loadingError}/></Grid>}
    </Grid>
  )
})

function templateProcess(tem: BasicTestModel, testUrl: TestUrl) {
  // Prevent it from becoming a template and some process
  tem.isTemplate = false;
  tem.name = 'Name of template ' + tem.name;
  tem.items.forEach(item => {
    // Remove the links of audios and audioRef
    if (item.type === TestItemType.example || item.type === TestItemType.training) {
      // Only ab test has different actions
      if (testUrl !== 'ab-test') item.example.audios = [];
      else item.example.audios.forEach((_, index) => item.example.audios[index] = null);
      item.example.audioRef = undefined;
    }
  });
}
