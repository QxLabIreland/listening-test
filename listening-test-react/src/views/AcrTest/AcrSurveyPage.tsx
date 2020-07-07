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
import {useParams} from "react-router";
import Loading from "../../layouts/components/Loading";
import {GlobalDialog} from "../../shared/ReactContexts";
import {Box} from "@material-ui/core";
import {BasicTestModel} from "../../shared/models/BasicTestModel";
import {RenderTestItem} from "../components/RenderTestItem";

export const AcrSurveyPage = observer(function (props: { url: 'acr-test'|'ab-test', value?: BasicTestModel}) {
  const {value} = props;
  const [questionnaire, setQuestionnaire] = useState<BasicTestModel>(value ? value : null);
  const [error, setError] = useState(undefined);
  const [openedPanel, setOpenedPanel] = useState(-1);
  const {id} = useParams();
  const globalDialog = useContext(GlobalDialog);

  useEffect(() => {
    if (!value) Axios.get<BasicTestModel>('/api/task/acr-test', {params: {_id: id}})
      .then(res => setQuestionnaire(observable(res.data)), reason => setError(reason.response.data));
  }, [id]);

  function handlePanelChange(v, index) {
    if (v) setOpenedPanel(index);
    else setOpenedPanel(null);
  }

  function handleSubmit() {
    Axios.post('/api/task/acr-test', toJS(questionnaire))
      .then(() => globalDialog('Thanks for your submitting! The page will be closed.', 'Done')); // , () => window.close()
  }

  return <>{questionnaire ? <Grid container spacing={3} direction="column">

    <Grid item xs={12}><Box pt={6}>
      <Typography variant="h3" gutterBottom>{questionnaire.name}</Typography>
      <Typography variant="body1" gutterBottom>{questionnaire.description}</Typography>
    </Box></Grid>
    {questionnaire.items.map((v, i) =>
      <Grid item xs={12} key={i}>
        <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
          <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1a-content">
            <Typography variant="h6" style={{marginLeft: 8}}>{v.label}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <RenderTestItem item={v}/>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
            {i !== questionnaire.items.length - 1 &&
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
