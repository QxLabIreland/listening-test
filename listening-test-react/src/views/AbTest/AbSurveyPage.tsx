import React, {useContext, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Icon from "@material-ui/core/Icon";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import {AbAudioController} from "./AbAudioController";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Axios from "axios";
import {useHistory, useParams} from "react-router";
import Loading from "../../layouts/components/Loading";
import {Box, MobileStepper} from "@material-ui/core";
import {RenderSurveyControl, SurveyControlValidate} from "../../shared/components/RenderSurveyControl";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {GlobalDialog} from "../../shared/ReactContexts";
import {TestItemModel} from "../../shared/models/BasicTestModel";
import {TestItemType} from "../../shared/models/EnumsAndTypes";

export const AbSurveyPage = observer(function (props: { value?: AbTestModel }) {
  const {value} = props;
  const [abTest, setTheTest] = useState<AbTestModel>(value ? value : null);
  const [error, setError] = useState(undefined);
  // Default is to open description and survey
  const [openedPanel, setOpenedPanel] = useState(-1);
  const {id} = useParams();
  const history = useHistory();

  const openDialog = useContext(GlobalDialog);
  const isIndividual = abTest?.settings?.isIndividual;
  // const [startTime] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    if (!value) Axios.get<AbTestModel>('/api/task/ab-test', {params: {_id: id}})
      .then(res => setTheTest(observable(res.data)), reason => setError(reason.response.data));
  }, [id, value]);

  function handlePanelChange(v: boolean, newIndex: number) {
    const validationError = openedPanel < 0 ? AbValidateSurveyError(abTest.survey) : AbValidateError(abTest.items[openedPanel]);
    if (validationError) openDialog(validationError, 'Validation error');
    // Set which panel will open, if validation pass.
    else if (v) {
      // // Timing process
      // if (abTest.settings?.isTimed) {
      //   if (abTest.items[newIndex]) startTime[newIndex] = new Date().getTime();
      //   // Add duration for current item
      //   if (abTest.items[openedPanel])
      //     abTest.items[openedPanel].time = (new Date().getTime() - startTime[openedPanel]) / 1000;
      // }
      // useState is async method, so put it at the end
      setOpenedPanel(newIndex);
    }
    // If the survey setting is individual question, DO NOTHING
    else if (!abTest.settings?.isIndividual) setOpenedPanel(null);
  }

  function handleSubmit() {
    AbValidateSurveyError(abTest.survey);
    // Check all items' validation before submission
    for (const item of abTest.items) {
      const validationError = AbValidateError(item);
      // If there is no error, check the next item
      if (!validationError) continue;
      openDialog(validationError, item.title + ' Required');
      return;
    }
    // // Record the last item time
    // if (abTest.settings?.isTimed)
    //   abTest.items[openedPanel].time = (new Date().getTime() - startTime[openedPanel]) / 1000;
    // Start request
    if (!value) Axios.post('/api/task/ab-test', toJS(abTest)).then(() => {
      history.replace('/task/finish');
    });
  }

  return <Box pt={6}>{abTest ? <Grid container spacing={3} direction="column">
    <Grid item xs={12}>
      <Typography variant="h3" gutterBottom>{abTest.name}</Typography>
    </Grid>
    {/*When the title and description doesn't show*/}
    <Grid item xs={12} hidden={isIndividual && openedPanel !== -1}>
      <Typography variant="body1" gutterBottom>{abTest.description}</Typography>
    </Grid>
    <Grid item xs={12} hidden={isIndividual && openedPanel !== -1}>
      <ExpansionPanel expanded={openedPanel === -1} onChange={(_, v) => handlePanelChange(v, -1)}>
        <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1a-content">
          <Typography variant="h6">A survey before test</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <RenderSurveyControls items={abTest.survey}/>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button size="small" color="primary"
                  onClick={() => handlePanelChange(true, 0)}>Next</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </Grid>
    {abTest.items.map((v, i) =>
      <Grid item xs={12} key={v.id} hidden={isIndividual && openedPanel !== i}>
        <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
          <ExpansionPanelSummary expandIcon={isIndividual ? null : <Icon>expand_more</Icon>}
                                 aria-controls="panel1a-content">
            <Typography variant="h6" style={{marginLeft: 8}}>Example {i + 1}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={3}>
              <AbAudioController value={v.example} active={openedPanel === i}/>
              <Grid item>
                <RenderSurveyControls items={v.example.fields}/>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            {i !== abTest.items.length - 1
              ? <Button color="primary" onClick={() => handlePanelChange(true, i + 1)}>Next</Button>
              : <Button disabled={!!value} variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            }
          </ExpansionPanelActions>
        </ExpansionPanel>
      </Grid>
    )}
    <Grid item xs={12}>
      <MobileStepper variant="text" steps={abTest.items.length} position="static" activeStep={openedPanel}
        nextButton={null} backButton={null}/>
    </Grid>
  </Grid> : <Loading error={!!error} message={error}/>}</Box>
})

const RenderSurveyControls = observer(function (props: { items: SurveyControlModel[] }) {
  const {items} = props;
  if (!items) return null;

  return <Grid container spacing={3}>
    {items.map((c, i) =>
      <Grid item xs={12} key={i}>
        <RenderSurveyControl control={c}/>
      </Grid>
    )}
  </Grid>
})

function AbValidateError(item: TestItemModel): string {
  if (!item) return null;
  if (item.type === TestItemType.example) {
    // Make sure ab test questions have been answered
    for (const a of item.example.fields) {
      const error = SurveyControlValidate(a);
      if (error) return error;
    }
    return null;
  }
  else return null;
}

function AbValidateSurveyError(questions: SurveyControlModel[]): string {
  for (const a of questions) {
    const error = SurveyControlValidate(a);
    if (error) return error;
  }
  return null;
}
