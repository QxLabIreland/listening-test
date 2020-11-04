import React, {useContext, useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Icon from "@material-ui/core/Icon";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import Axios from "axios";
import {useHistory, useParams} from "react-router";
import Loading from "../../layouts/components/Loading";
import {Box, MobileStepper} from "@material-ui/core";
import {BasicTaskItemModel, BasicTaskModel} from "../../shared/models/BasicTaskModel";
import {GlobalDialog} from "../../shared/ReactContexts";
import {SurveyControlType, TestItemType, TestUrl} from "../../shared/models/EnumsAndTypes";
import {
  questionedExValidateError,
  sliderItemValidateError,
  testItemsValidateIncomplete
} from "../../shared/ErrorValidators";
import {TestItemCardRender} from "../components/TestItemCard.render";

export const SurveyPage = observer(function ({value, testUrl}: { value?: BasicTaskModel, testUrl: TestUrl }) {
  const [questionnaire, setQuestionnaire] = useState<BasicTaskModel>();
  const [error, setError] = useState<string>();
  const [openedPanel, setOpenedPanel] = useState(0);
  const {id} = useParams();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const [startTime] = useState<{ [key: number]: number }>({});
  // Expose isIndividual setting to reduce code
  const isIndividual = questionnaire?.settings?.isIndividual;
  const {validateError} = useSurveyRenderItem(testUrl);
  // To get data from the server or load data
  useEffect(() => {
    // If there is a value, it means we are in preview mode
    if (value) {
      const validateError = testItemsValidateIncomplete(value);
      if (validateError) setError('The task is incomplete: ' + validateError);
      else setQuestionnaire(observable(value));
    } else Axios.get<BasicTaskModel>('/api/task/' + testUrl, {params: {_id: id}}).then(res => {
      const validateError = testItemsValidateIncomplete(res.data);
      if (validateError) setError('The survey is incomplete. If you are creator: ' + validateError);
      else setQuestionnaire(observable(res.data));
    }, reason => setError(reason.response.data));
  }, [testUrl, id, value]);
  // If isIndividual, goto description
  useEffect(() => {
    if (questionnaire?.settings?.isIndividual) setOpenedPanel(-1);
  }, [questionnaire])

  function handlePanelChange(v: boolean, newIndex: number) {
    const validationError = validateError(questionnaire.items[openedPanel]);
    if (validationError) openDialog(validationError, 'Answer Required');
    // Set which panel will open, if validation pass.
    else if (v) {
      // Timing process
      if (questionnaire.settings?.isTimed) {
        // Record start time for next one.
        if (questionnaire.items[newIndex]) startTime[newIndex] = new Date().getTime();
        // Add duration for current item
        if (questionnaire.items[openedPanel])
          questionnaire.items[openedPanel].time = (new Date().getTime() - startTime[openedPanel]) / 1000;
      }
      const indexOverride = gotoQuestionChecking(questionnaire.items[openedPanel], questionnaire);
      // useState is async method, so put it at the end
      setOpenedPanel(indexOverride !== null ? indexOverride : newIndex);
    }
    // If the survey setting is individual question, DO NOTHING
    else if (!questionnaire.settings?.isIndividual) setOpenedPanel(null);
  }

  function handleSubmit() {
    // Check all items' validation before submission. Only if the questionnaire is not individual
    if (!questionnaire.settings?.isIndividual) for (const item of questionnaire.items) {
      const validationError = validateError(item);
      // If there is no error, check the next item
      if (!validationError) continue;
      openDialog(validationError, 'Validation Error');
      return;
    }
    // Record the last item time
    if (questionnaire.settings?.isTimed)
      questionnaire.items[openedPanel].time = (new Date().getTime() - startTime[openedPanel]) / 1000;
    // Set opened to make sure an active variable of the audio is false
    setOpenedPanel(null);
    // Start request
    if (!value) Axios.post('/api/task/' + testUrl, toJS(questionnaire)).then(res => {
      history.replace(`/task/finish?${res.data?.$oid}&${testUrl}`, true);
    });
  }
  // Show panel actions based on various parameters
  const panelActions = (index: number, isSectionHeader: boolean = false) => {
    if ((questionnaire.settings.isIndividual && isSectionHeader) || !isSectionHeader)
      if (index < questionnaire.items.length - 1)
        return <Button color="primary" onClick={() => handlePanelChange(true, index + 1)}>Next</Button>
      else return <Button disabled={!!value} variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
    else return null;
  }
  return <Box pt={6}>{questionnaire ? <Grid container spacing={3} direction="column">
    <Grid item xs={12}>
      <Typography variant="h3" gutterBottom>{questionnaire.name}</Typography>
    </Grid>
    {/*When the title and description doesn't show*/}
    {(!isIndividual || openedPanel === -1) && <Grid item xs={12}>
      <Typography variant="body1" gutterBottom>{questionnaire.description}</Typography>
      {isIndividual && <div style={{textAlign: 'right'}}>
        <Button color="primary" onClick={() => handlePanelChange(true, 0)}>Next</Button>
      </div>}
    </Grid>}
    {questionnaire.items.map((v, i) =>
      <Grid item xs={12} key={v.id} hidden={isIndividual && openedPanel !== i}>{v.type !== TestItemType.sectionHeader ?
        <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
          <ExpansionPanelSummary expandIcon={isIndividual ? null : <Icon>expand_more</Icon>}
                                 aria-controls="panel1a-content">
            <Typography variant="h6" style={{marginLeft: 8}}>{v.title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <TestItemCardRender testUrl={testUrl} item={v} active={openedPanel === i}/>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>{panelActions(i)}</ExpansionPanelActions>
        </ExpansionPanel> : <div>
          <Typography variant="h4">{questionnaire.name}</Typography>
          <ExpansionPanelActions>{panelActions(i, true)}</ExpansionPanelActions>
        </div>}
      </Grid>
    )}
    <Grid item xs={12}>
      <MobileStepper variant="text" position="static" steps={questionnaire.items.length} activeStep={openedPanel}
                     nextButton={null} backButton={null}
      />
    </Grid>
  </Grid> : <Loading error={error}/>}</Box>
})

function gotoQuestionChecking(item: BasicTaskItemModel, questionnaire: BasicTaskModel): number {
  // Don't override when it is not an individual questionnaire
  if (item?.type !== TestItemType.question || !questionnaire.settings?.isIndividual) return null;
  const control = item.questionControl;
  // Make sure the type and the mapping has value
  if (control.type === SurveyControlType.radio && control.gotoQuestionMapping) {
    const targetId = control.gotoQuestionMapping[control.options.indexOf(control.value)];
    if (targetId) {
      const index = questionnaire.items.findIndex(item => item.id === targetId);
      if (index > -1) return index;
    }
  }
  return null;
}

// An hook to switch different views of card
function useSurveyRenderItem(testUrl: TestUrl): { validateError: (item: BasicTaskItemModel) => string } {
  const validateError = () => {
    switch (testUrl) {
      case "ab-test":
      case "audio-labeling": // Only use fields validation
      case "image-labeling":
      case "image-ab":
      case "video-labeling":
      case "video-ab":
        return questionedExValidateError;
      case "acr-test":
      case "mushra-test":
      case "hearing-test":
        return sliderItemValidateError;
      default:
        return null;
    }
  }
  return {validateError: validateError()}
}

