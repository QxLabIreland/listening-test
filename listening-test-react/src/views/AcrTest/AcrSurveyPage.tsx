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
import {BasicTestModel} from "../../shared/models/BasicTestModel";
import {AcrSurveyRenderItem, ItemValidateError} from "./AcrSurveyRenderItem";
import {isDevMode} from "../../shared/ReactTools";
import {GlobalDialog} from "../../shared/ReactContexts";

export const AcrSurveyPage = observer(function ({value}: { value?: BasicTestModel }) {
  const [questionnaire, setQuestionnaire] = useState<BasicTestModel>(value ? value : null);
  const [error, setError] = useState(undefined);
  const [openedPanel, setOpenedPanel] = useState(-1);
  const {id} = useParams();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);

  useEffect(() => {
    if (!value) Axios.get<BasicTestModel>('/api/task/acr-test', {params: {_id: id}})
      .then(res => setQuestionnaire(observable(res.data)), reason => setError(reason.response.data));
  }, [id]);

  function handlePanelChange(v, newIndex, index = null) {
    const validationError = ItemValidateError(questionnaire.items[index ? index : newIndex]);
    if (validationError) openDialog(validationError, 'Required');
    // Set which panel will open, if validation pass
    else if (v) setOpenedPanel(newIndex);
    // If the survey setting is individual question, do nothing
    else if (!questionnaire.settings?.isIndividual) setOpenedPanel(null);
  }

  function handleSubmit() {
    // Check validation before submission
    const validationError = ItemValidateError(questionnaire.items[questionnaire.items.length - 1]);
    if (validationError) openDialog(validationError, 'Required');
    else if (!value) Axios.post('/api/task/acr-test', toJS(questionnaire)).then(() => {
      if (!isDevMode()) history.replace('/task/finish');
    });
  }

  const isIndividual = questionnaire?.settings?.isIndividual;

  return <Box pt={6}>{questionnaire ? <Grid container spacing={3} direction="column">
    <Grid item xs={12}>
      <Typography variant="h3" gutterBottom>{questionnaire.name}</Typography>
    </Grid>
    {/*When the title and description doesn't show*/}
    {!(isIndividual && openedPanel !== -1) && <Grid item xs={12}>
      <Typography variant="body1" gutterBottom>{questionnaire.description}</Typography>
      <div style={{textAlign: 'right'}}>
        <Button color="primary" onClick={() => handlePanelChange(true, 0)}>Next</Button>
      </div>
    </Grid>}
    {questionnaire.items.map((v, i) =>
      <Grid item xs={12} key={v.id} hidden={isIndividual && openedPanel !== i}>
        {/*{v.type === TestItemType.question && v.questionControl.type === SurveyControlType.description
          ? <Card>
            <CardHeader title={v.title}/>
            <CardContent>{v.questionControl.question}</CardContent>
            <CardActions style={{justifyContent: 'flex-end'}}>
              <Button size="small" color="primary"
                      onClick={() => handlePanelChange(true, i + 1)}>Next</Button>
            </CardActions>
          </Card>*/}
        <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
          <ExpansionPanelSummary expandIcon={isIndividual ? null : <Icon>expand_more</Icon>} aria-controls="panel1a-content">
            <Typography variant="h6" style={{marginLeft: 8}}>{v.title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <AcrSurveyRenderItem item={v} active={openedPanel === i}/>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            {i !== questionnaire.items.length - 1
              ? <Button color="primary" onClick={() => handlePanelChange(true, i + 1, i)}>Next</Button>
              : <Button disabled={!!value} variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            }
          </ExpansionPanelActions>
        </ExpansionPanel>
      </Grid>
    )}
    {/*<Grid item xs={12} hidden={!!value}>
      <Grid container justify="flex-end">
        <Button hidden={!!value} variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </Grid>
    </Grid>*/}
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
  </Grid> : <Loading error={!!error} message={error}/>}</Box>
})