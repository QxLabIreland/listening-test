import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Icon from "@material-ui/core/Icon";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import SurveyAudioController from "../components/SurveyAudioController";
import {observable, toJS} from "mobx";
import {observer} from "mobx-react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AudioExampleRadio from "./AudioExampleRadio";
import CardHeader from "@material-ui/core/CardHeader";
import SurveyCardView from "../components/SurveyCardView";
import {CardActions} from "@material-ui/core";

export default observer(function AbTaskPage() {
  const [theTest] = useState(observable({
    id: 0,
    survey: [
      {type: 0, question: 'Text test'},
      {type: 1, question: 'Radio test', options: ['1', '2', '3']},
      {type: 2, question: 'Checkbox test', options: ['a', 'b', 'c']},
    ],
    examples: [{
      id: 0,
      answer: null,
      audioA:{
        id: 1,
        filename: 'audio-a',
        src: '/test/A Himitsu - Lost Within.mp3',
        isPlaying: false,
        selected: false
      },
      audioB:{
        id: 2,
        filename: 'audio-b',
        src: '/test/Hinkik A Himitsu - Realms.mp3', // /test/Hinkik A Himitsu - Realms.mp3
        isPlaying: false,
        selected: false
      },
      audioRef: null
    }, {
      id: 1,
      answer: null,
      audioA:{
        id: 1,
        filename: 'audio-a',
        src: '/test/A Himitsu - Lost Within.mp3',
        isPlaying: false,
        selected: false
      },
      audioB:{
        id: 2,
        filename: 'audio-b',
        src: '/test/Hinkik A Himitsu - Realms.mp3', // /test/Hinkik A Himitsu - Realms.mp3
        isPlaying: false,
        selected: false
      },
      audioRef:{
        id: 3,
        filename: 'audio-b',
        src: '/test/Hinkik A Himitsu - Realms.mp3', // /test/Hinkik A Himitsu - Realms.mp3
        isPlaying: false,
        selected: false
      }
    }]
  }));

  const [openedPanel, setOpenedPanel] = useState(null);

  function handlePanelChange(v, index) {
    if (v) setOpenedPanel(index);
    else setOpenedPanel(null);
  }

  function handleSubmit() {
    alert(JSON.stringify(toJS(theTest)));
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12}><Typography variant="h2" gutterBottom>
        Audio AB Test: {'example 1'}
      </Typography>
        <Card>
          <CardHeader title="AB test Survey"/>
          <CardContent>
            <SurveyCardView items={theTest.survey}/>
          </CardContent>
          <CardActions style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button color="primary" onClick={() => setOpenedPanel(0)}>Goto Example</Button>
          </CardActions>
        </Card>
      </Grid>
      {theTest.examples.map((ex, i) =>
        <Grid item xs={12} key={ex.id}>
          <ExpansionPanel expanded={openedPanel === i} onChange={(_, v) => handlePanelChange(v, i)}>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1a-content">
              {ex.answer && <Icon>check</Icon>}
              <Typography variant="h6" style={{marginLeft: 8}}>Example {i + 1}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={3}>
                <SurveyAudioController audios={[ex.audioA, ex.audioB]} audioRef={ex.audioRef}/>
                <AudioExampleRadio example={ex}/>
              </Grid>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              {i !== theTest.examples.length - 1 &&
              <Button size="small" color="primary"
                      onClick={() => handlePanelChange(true, i + 1)}>Next Example</Button>}
            </ExpansionPanelActions>
          </ExpansionPanel>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container justify="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </Grid>
  )
})
