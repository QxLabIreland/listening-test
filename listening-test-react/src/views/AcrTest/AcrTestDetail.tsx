import {Prompt, useHistory, useParams} from "react-router";
import React, {useContext, useEffect, useState} from "react";
import {AbTestModel} from "../../shared/models/AbTestModel";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import {useScrollToView} from "../../shared/ReactHooks";
import Axios from "axios";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {Box, ListItemIcon, ListItemText, Menu, MenuItem, TextField, Typography} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import Loading from "../../layouts/components/Loading";
import {SurveyControlType, TestItemType} from "../../shared/ReactEnumsAndTypes";
import {BasicTestModel, TestItemModel} from "../../shared/models/BasicTestModel";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {AcrTestItemCard} from "./AcrTestItemCard";
import {observer} from "mobx-react";
import {observable} from "mobx";
import {uuid} from "uuidv4";

export const AcrTestDetail = observer(function () {
  const {id} = useParams();
  const [tests, setTests] = useState<BasicTestModel>(null);
  const [isError, setIsError] = useState(false);
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const openSnackbar = useContext(GlobalSnackbar);
  // Scroll properties
  const {viewRef, scrollToView} = useScrollToView();
  // No submit alert variable
  const [isSubmitted, setIsSubmitted] = useState<boolean>(null);

  // Request for server methods
  useEffect(() => {
    // If it is edit page, get data from back end
    if (+id !== 0) Axios.get<AbTestModel>('/api/acr-test', {params: {_id: id}})
      // Successful callback
      .then((res) => setTests(observable(res.data)), () => setIsError(true));
    // If in creation page
    else setTests(observable({name: '', description: '', items: []}));
  }, []);

  const handleSubmit = () => {
    // Validate if all examples have been added audios
    const validationResult = validate(tests);
    if (validationResult) {
      openDialog(validationResult);
      return;
    }
    // Create a new text or modify current test
    if (+id === 0) {
      requestServer(true);
    } else Axios.get('/api/response-count', {params: {testId: id, testType: 'acrTest'}}).then(res => {
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
      method: isNew ? 'POST' : 'PUT', url: '/api/acr-test', data: tests
    }).then(() => {
      history.push('./');
      openSnackbar('Save successfully');
    }, reason => openDialog(reason.response.data, 'Something wrong'));
  }

  // Local methods
  function addItem(newItem: TestItemModel) {
    tests.items.push(newItem);
    scrollToView();
  }

  function deleteItem(index) {
    tests.items.splice(index, 1);
  }

  const validate = (tests: BasicTestModel) => {
    for (const item of tests.items) {
      if (item.example && (!item.example.audios || item.example.audios.length < 1)) {
        return 'Please add at least one audio for every example'
      }
    }
    return null;
  }

  // Some components for performance boost
  const NameText = () => <TextField variant="outlined" label="Test Name" fullWidth defaultValue={tests.name}
                                    onChange={e => tests.name = e.target.value}/>;
  const DesText = () => <TextField variant="outlined" label="Test Description" rowsMax={8} multiline fullWidth
                                   defaultValue={tests.description}
                                   onChange={(e) => tests.description = e.target.value}/>;
  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Prompt when={!isSubmitted}
              message='You have unsaved changes, are you sure you want to leave?'/>

      {tests ? <React.Fragment>
        <Grid item xs={12} style={{display: 'flex'}}>
          <span style={{flexGrow: 1}}/>
          <Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button>
        </Grid>
        <Grid item xs={12}><NameText/></Grid>
        <Grid item xs={12}><DesText/></Grid>
        {tests.items.map((v, i) =>
          <Grid item xs={12} key={v.id} ref={viewRef}>
            <AcrTestItemCard value={v} onDelete={() => deleteItem(i)}/>
          </Grid>
        )}
        <Grid item container justify="center" xs={12}>
          <AddItemButtonGroup onAdd={addItem}/>
        </Grid>
      </React.Fragment> : <Grid item><Loading error={isError}/></Grid>}
    </Grid>
  )
})

const AddItemButtonGroup = observer(function (props: { onAdd: (type: TestItemModel) => void }) {
  const {onAdd} = props;
  const classes = makeStyles((theme: Theme) => createStyles({
    buttonGroup: {
      '& > *': {margin: theme.spacing(0.5)}
    }
  }))();

  const handleAdd = (type: TestItemType) => {
    let newItem: TestItemModel;
    switch (type) {
      case TestItemType.example:
        newItem = {
          id: uuid(), type: TestItemType.example, title: 'Example (Click to edit this)', example: {
            audios: [], fields: [
              {type: SurveyControlType.description, question: 'Rate the quality of these sounds.', value: null}
            ]
          }
        };
        break;
      case TestItemType.training:
        newItem = {
          id: uuid(), type: TestItemType.training, title: 'Training Example (Click to edit this)', example: {
            audios: [], fields: [
              {type: SurveyControlType.description, question: 'Please listen these sounds.', value: null}
            ]
          }
        };
        break;
      case TestItemType.sectionHeader:
        newItem = {
          id: uuid(), type: TestItemType.sectionHeader, title: 'Training Example', // titleDes: {title: 'New Title', description: 'Optional Description'}
        };
        break;
    }
    onAdd(newItem);
  }

  const handleQuestionAdd = question => onAdd({
    id: uuid(), type: TestItemType.question, title: 'Survey Question (Click to edit this)', questionControl: question
  });

  return <Box className={classes.buttonGroup}>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.example)}>
      <Icon>add</Icon>Add Example
    </Button>
    <Button variant="outlined" color="primary" onClick={() => handleAdd(TestItemType.training)}>
      <Icon>add</Icon>Add Training Example
    </Button>
    <AddQuestionButton onQuestionAdd={handleQuestionAdd}/>
  </Box>
});

const AddQuestionButton = observer(function (props: { onQuestionAdd: (question: SurveyControlModel) => void }) {
  const {onQuestionAdd} = props;
  // When menu clicked
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleAddMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdd = (type: SurveyControlType) => {
    // Close the adding menu
    setAnchorEl(null);
    // Check controls types
    switch (type) {
      case SurveyControlType.radio:
      case SurveyControlType.checkbox:
        onQuestionAdd({type: type, question: 'Untitled question', options: ['Add your options!'], value: null});
        break;
      case SurveyControlType.text:
        onQuestionAdd({type: type, question: 'Untitled question', value: null});
        break;
      case SurveyControlType.description:
        onQuestionAdd({type: type, question: 'Type you description here', value: null});
        break;
    }
  }

  return <>
    {/*Adding menu Button*/}
    <Button variant="outlined" color="primary" onClick={handleAddMenuClick}><Icon>more_vert</Icon>Add Survey
      Question</Button>
    <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
      <MenuItem disabled>
        <Typography variant="body1"><strong>Answer Input Type</strong></Typography>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
        <ListItemIcon>
          <Icon fontSize="small">text_fields</Icon>
        </ListItemIcon>
        <ListItemText primary="Text Input"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
        <ListItemIcon>
          <Icon fontSize="small">radio_button_checked</Icon>
        </ListItemIcon>
        <ListItemText primary="Radio Group"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
        <ListItemIcon>
          <Icon fontSize="small">check_box</Icon>
        </ListItemIcon>
        <ListItemText primary="Checkbox Group"/>
      </MenuItem>
      <MenuItem onClick={() => handleAdd(SurveyControlType.description)}>
        <ListItemIcon>
          <Icon fontSize="small">label</Icon>
        </ListItemIcon>
        <ListItemText primary="A Text Label"/>
      </MenuItem>
    </Menu>
  </>;
});

