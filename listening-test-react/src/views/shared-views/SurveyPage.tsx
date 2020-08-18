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
import {BasicTestModel, TestItemModel} from "../../shared/models/BasicTestModel";
import {GlobalDialog} from "../../shared/ReactContexts";
import {TestUrl} from "../../shared/models/EnumsAndTypes";
import {AbSurveyRenderItem} from "../AbTest/AbSurveyRenderItem";
import {AcrSurveyRenderItem} from "../AcrTest/AcrSurveyRenderItem";
import {MushraSurveyRenderItem} from "../Mushra/MushraSurveyRenderItem";
import {HearingSurveyRenderItem} from "../HearingTest/HearingSurveyRenderItem";
import {questionedExValidateError, sliderItemValidateError} from "../../shared/ErrorValidators";

export const SurveyPage = observer(function ({value, testUrl}: { value?: BasicTestModel, testUrl: TestUrl }) {
  const [questionnaire, setQuestionnaire] = useState<BasicTestModel>(value ? value : null);
  const [error, setError] = useState(undefined);
  const [openedPanel, setOpenedPanel] = useState(0);
  const {id} = useParams();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const [startTime] = useState<{ [key: number]: number }>({});
  // Expose isIndividual setting to reduce code
  const isIndividual = questionnaire?.settings?.isIndividual;
  const {RenderedItem, validateError} = useSurveyRenderItem(testUrl);

  useEffect(() => {
    if (value) return;
    Axios.get<BasicTestModel>('/api/task/' + testUrl, {params: {_id: id}})
      .then(res => setQuestionnaire(observable(res.data)), reason => setError(reason.response.data));
  }, [testUrl, id, value]);
  // If isIndividual, goto description
  useEffect(() => {
    if (questionnaire?.settings?.isIndividual) setOpenedPanel(-1);
  }, [questionnaire])

  function handlePanelChange(v: boolean, newIndex: number) {
    const validationError = validateError(questionnaire.items[openedPanel]);
    if (validationError) openDialog(validationError, 'Required');
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
      // useState is async method, so put it at the end
      setOpenedPanel(newIndex);
    }
    // If the survey setting is individual question, DO NOTHING
    else if (!questionnaire.settings?.isIndividual) setOpenedPanel(null);
  }

  function handleSubmit() {
    // Check all items' validation before submission
    for (const item of questionnaire.items) {
      const validationError = validateError(item);
      // If there is no error, check the next item
      if (!validationError) continue;
      openDialog(validationError, 'Validation Error');
      return;
    }
    // Record the last item time
    if (questionnaire.settings?.isTimed)
      questionnaire.items[openedPanel].time = (new Date().getTime() - startTime[openedPanel]) / 1000;
    // Set opened to make sure active is false
    setOpenedPanel(null);
    // Start request
    if (!value) Axios.post('/api/task/' + testUrl, toJS(questionnaire)).then(() => {
      history.replace('/task/finish');
    });
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
      <Grid item xs={12} key={v.id} hidden={isIndividual && openedPanel !== i}>
        <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
          <ExpansionPanelSummary expandIcon={isIndividual ? null : <Icon>expand_more</Icon>}
                                 aria-controls="panel1a-content">
            <Typography variant="h6" style={{marginLeft: 8}}>{v.title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RenderedItem item={v} active={openedPanel === i}/>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            {i !== questionnaire.items.length - 1
              ? <Button color="primary" onClick={() => handlePanelChange(true, i + 1)}>Next</Button>
              : <Button disabled={!!value} variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            }
          </ExpansionPanelActions>
        </ExpansionPanel>
      </Grid>
    )}
    <Grid item xs={12}>
      <MobileStepper
        variant="text"
        steps={questionnaire.items.length}
        position="static"
        activeStep={openedPanel}
        nextButton={null}
        backButton={null}
      />
    </Grid>
  </Grid> : <Loading error={error}/>}</Box>
})

// An hook to switch different views of card
function useSurveyRenderItem(testUrl: TestUrl): { RenderedItem: (props: { item: TestItemModel, active?: boolean }) => JSX.Element, validateError: (item: TestItemModel) => string } {
  // Switch to right rendering item
  const renderItemByTestUrl = () => {
    switch (testUrl) {
      case "ab-test":
        return AbSurveyRenderItem
      case "acr-test":
        return AcrSurveyRenderItem
      case "mushra-test":
        return MushraSurveyRenderItem
      case "hearing-test":
        return HearingSurveyRenderItem
      default:
        return null;
    }
  }

  const validateError = () => {
    switch (testUrl) {
      case "ab-test":
        return questionedExValidateError;
      case "acr-test":
      case "mushra-test":
      case "hearing-test":
        return sliderItemValidateError;
      default:
        return null;
    }
  }
  return {RenderedItem: renderItemByTestUrl(), validateError: validateError()}
}

