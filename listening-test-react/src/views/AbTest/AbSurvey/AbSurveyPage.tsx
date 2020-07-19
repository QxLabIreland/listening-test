import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Icon from "@material-ui/core/Icon";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import {SurveyAudioController} from "./SurveyAudioController";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import {AbTestModel} from "../../../shared/models/AbTestModel";
import Axios from "axios";
import {useHistory, useParams} from "react-router";
import Loading from "../../../layouts/components/Loading";
import {Box} from "@material-ui/core";
import {RenderSurveyControl} from "../../../shared/components/RenderSurveyControl";
import {SurveyControlModel} from "../../../shared/models/SurveyControlModel";
import {isDevMode} from "../../../shared/ReactTools";

export const AbSurveyPage = observer(function (props: { value?: AbTestModel }) {
  const {value} = props;
  const [theTest, setTheTest] = useState<AbTestModel>(value ? value : null);
  const [error, setError] = useState(undefined);
  const [openedPanel, setOpenedPanel] = useState(-1);
  const {id} = useParams();
  const history = useHistory();

  useEffect(() => {
    if (!value) Axios.get<AbTestModel>('/api/task/ab-test', {params: {_id: id}})
      .then(res => setTheTest(observable(res.data)), reason => setError(reason.response.data))
  }, [id]);

  function handlePanelChange(v, index) {
    if (v) setOpenedPanel(index);
    else setOpenedPanel(null);
  }

  function handleSubmit() {
    Axios.post('/api/task/ab-test', toJS(theTest)).then(() => {
      if (!isDevMode()) history.replace('/task/finish');
    });
  }

  return <>{theTest ? <Grid container spacing={3} direction="column">

    <Grid item xs={12}><Box pt={6}>
      <Typography variant="h3" gutterBottom>{theTest.name}</Typography>
      <Typography variant="body1" gutterBottom>{theTest.description}</Typography>
    </Box></Grid>
    <Grid item xs={12}>
      <ExpansionPanel expanded={openedPanel === -1} onChange={(_, v) => handlePanelChange(v, -1)}>
        <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1a-content">
          <Typography variant="h6">A survey before test</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <RenderSurveyControls items={theTest.survey}/>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button size="small" color="primary"
                  onClick={() => setOpenedPanel(0)}>Next</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    </Grid>
    {theTest.examples.map((ex, i) =>
      <Grid item xs={12} key={i}>
        <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
          <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1a-content">
            {ex.questions[0].value && <Icon>check</Icon>}
            <Typography variant="h6" style={{marginLeft: 8}}>Example {i + 1}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={3}>
              {/*TODO Expose the pause*/}
              <SurveyAudioController audios={ex.audios} audioRef={ex.audioRef}/>
              <Grid item>
                <RenderSurveyControls items={ex.questions}/>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            {i !== theTest.examples.length - 1 &&
            <Button size="small" color="primary"
                    onClick={() => handlePanelChange(true, i + 1)}>Next</Button>}
          </ExpansionPanelActions>
        </ExpansionPanel>
      </Grid>
    )}

    <Grid item xs={12} hidden={!!value}>
      <Grid container justify="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
      </Grid>
    </Grid>
  </Grid> : <Loading error={!!error} message={error}/>}</>
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

