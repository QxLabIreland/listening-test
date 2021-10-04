import {Prompt, useHistory, useLocation, useParams} from "react-router";
import React, {FunctionComponent, useContext, useEffect, useState} from "react";
import {GlobalDialog, GlobalSnackbar} from "../../../shared/ReactContexts";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Checkbox, FormControlLabel, Icon, IconButton, TextField} from "@material-ui/core";
import Loading from "../../../layouts/components/Loading";
import {TestItemType, TestUrl} from "../../../shared/models/EnumsAndTypes";
import {BasicTaskItemModel, BasicTaskModel} from "../../../shared/models/BasicTaskModel";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {TestSettingsDialog} from "./TestSettingsDialog";
import {TestDetailItemCardList} from "./TestDetailItemCardList";
import {deepObserve} from "mobx-utils";
import Tooltip from "@material-ui/core/Tooltip";
import {ResponsePreviewDialog} from "../test-responses/ResponsePreviewDialog";
import {ShareLinkDialog} from "../ShareLinkDialog";
import {DetailTaskModel} from "../../../shared/ReactContexts";

export const TestDetailView = observer(function ({testUrl, ButtonGroup}: {
  testUrl: TestUrl,
  ButtonGroup: FunctionComponent<{ onAdd: (type: BasicTaskItemModel) => void }>
}) {
  const {id} = useParams();
  const [testModel, setTestModel] = useState<BasicTaskModel>(null);
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
    if (location.state || +id !== 0) Axios.get<BasicTaskModel>('/api/' + testUrl, {params: {_id: location.state || id}})
      .then((res) => {
        if (location.state) templateProcess(res.data, testUrl);
        const testModelObservable = addAnObserveForChanges(res.data);
        setTestModel(testModelObservable);
      }, res => setLoadingError(res.response.data));
    // If in creation page
    else {
      const data = {name: '', description: '', items: [] as BasicTaskItemModel[]};
      const testModelObs = addAnObserveForChanges(data);
      // Default individual question page
      if (testUrl.includes('image') || testUrl.includes('video'))
        testModelObs.settings = {...testModelObs.settings, isIndividual: true}
      setTestModel(testModelObs);
    }
  }, [id, testUrl, location.state]);

  const addAnObserveForChanges = (data: BasicTaskModel) => {
    /** Stringify the data for unsaved modification detection */
    const theTestStr = JSON.stringify(data);
    const dataObservable = observable(data);
    // Add an observe to set if is data changed
    deepObserve(dataObservable, (newValue) => {
      setIsTestChanged(JSON.stringify(newValue.object) !== theTestStr);
    });
    return dataObservable;
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
  const handleSubmit = () => {
    // Create a new text or modify current test
    if (+id === 0) requestServer(true);
    else Axios.get('/api/response-count', {params: {testId: id, testType: testUrl}}).then(res => {
      // After checking with server, if there are responses, it will create a new test.
      if (res.data > 0) openDialog(
        'This test has already accepted some responses. Tap Save to create a new duplicate of this test. You can delete old one if you require.',
        'Reminder', null, () => requestServer(true));
      else requestServer(false);
    });
  }
  // Local methods
  const addItem = (newItem: BasicTaskItemModel) => testModel.items.push(newItem);

  return <Grid container spacing={2} justify="center" alignItems="center" id='containerTestDetailItemCardList'>
    <Prompt when={isTestChanged} message={'You have unsaved changes, are you sure you want to leave?'}/>
    {testModel ? <React.Fragment>
      <DetailViewActions testUrl={testUrl} testModel={testModel} isTestChanged={isTestChanged}
                         handleSubmit={handleSubmit}/>
      <Grid item xs={12}>
        <TextField variant="outlined" label="Test Name" fullWidth defaultValue={testModel.name} name="name"
                   onChange={e => testModel.name = e.target.value}/>
      </Grid>
      <Grid item xs={12}>
        <TextField variant="outlined" label="Test Description" rowsMax={8} multiline fullWidth
                   defaultValue={testModel.description} name="description"
                   onChange={(e) => testModel.description = e.target.value}/>
      </Grid>
      <DetailTaskModel.Provider value={testModel}>
        <TestDetailItemCardList items={testModel.items} testUrl={testUrl}/>
        <Grid item container justify="center" xs={12}>
          <ButtonGroup onAdd={addItem}/>
        </Grid>
      </DetailTaskModel.Provider>
      <DetailViewActions testUrl={testUrl} testModel={testModel} isTestChanged={isTestChanged}
                         handleSubmit={handleSubmit}/>
    </React.Fragment> : <Grid item><Loading error={loadingError}/></Grid>}
  </Grid>
})

const DetailViewActions = observer(function (props: { testModel: BasicTaskModel, testUrl: TestUrl, isTestChanged: boolean, handleSubmit: () => void }) {
  const {testModel, testUrl, isTestChanged, handleSubmit} = props
  // Share Dialog state
  const shareDialogState = React.useState(false);

  return <Grid item xs={12} container alignItems="center" spacing={1}>
    <Grid item style={{flexGrow: 1}}/>
    <Grid item>
      <Tooltip title="If you don't wanna receive more responses, you can check this option">
        <FormControlLabel label="Stop receiving responses" control={
          <Checkbox checked={testModel.stopReceivingRes || false} color="primary" name="policy"
                    onChange={event => testModel.stopReceivingRes = event.target.checked}/>
        }/>
      </Tooltip>
    </Grid>
    <Grid item><Tooltip title="Click to fold or expand all cards">
      <FormControlLabel label="Collapse All" control={
        <Checkbox color="primary" checked={testModel.items.every(v => v.collapsed)}
                  indeterminate={testModel.items.some(v => v.collapsed) && !testModel.items.every(v => v.collapsed)}
                  onChange={e => testModel.items.forEach(v => v.collapsed = e.target.checked)}/>
      }/>
    </Tooltip></Grid>
    <Grid item><TestSettingsDialog settings={testModel.settings}
                                   onConfirm={settings => testModel.settings = settings}/></Grid>
    <Grid item>
      <Tooltip title="Preview Test">
        <ResponsePreviewDialog testUrl={testUrl} taskModel={testModel}/>
      </Tooltip>
    </Grid>
    <Grid item>
      <Tooltip title={isTestChanged ? 'You must SAVE first' : "Open and share this test"}><span>
        <IconButton onClick={() => shareDialogState[1](true)} disabled={isTestChanged || !testModel._id}>
          <Icon>share</Icon>
        </IconButton>
      </span></Tooltip>
      <ShareLinkDialog taskUrl={testUrl} task={testModel} shareDialogState={shareDialogState}/>
    </Grid>
    <Grid item>
      <Button color="primary" variant="contained" onClick={handleSubmit} disabled={!isTestChanged}>
        Save{!isTestChanged && 'd'}
      </Button>
    </Grid>
  </Grid>
});

function templateProcess(tem: BasicTaskModel, testUrl: TestUrl) {
  // Prevent it from becoming a template and some process
  tem.isTemplate = false;
  tem.name = 'Name of template ' + tem.name;
  tem.items.forEach(item => {
    // Remove the links of audios and audioRef
    if (item.type === TestItemType.example || item.type === TestItemType.training) {
      // Only ab test needs to keep audio placeholders
      if (testUrl !== 'ab-test') item.example.medias = [];
      else item.example.medias.forEach((_, index) => item.example.medias[index] = null);
      item.example.mediaRef = undefined;
    }
  });
}
