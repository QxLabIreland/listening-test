import React, {useRef, useState} from "react";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Icon from "@material-ui/core/Icon";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import AudioController from "../components/AudioController";
import {observable} from "mobx";
import {observer} from "mobx-react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import AudioExampleRadio from "./AudioExampleRadio";
import CardHeader from "@material-ui/core/CardHeader";
import {AudioModel} from "../../shared/models/AudioModel";
import SurveyCard from "../components/SurveryCard";

export default observer(function AbTaskPage() {
  const [theTest] = useState(observable({
    id: 0,
    survey: 'json form',
    examples: [{
      id: 0,
      answer: null,
      audios: [{
        filename: 'audio-a',
        ref: useRef({}),
        src: '/test/A Himitsu - Lost Within.mp3',
        isPlaying: false,
        selected: false
      }, {
        filename: 'audio-b',
        ref: useRef({}),
        src: '/test/Hinkik A Himitsu - Realms.mp3', // /test/Hinkik A Himitsu - Realms.mp3
        isPlaying: false,
        selected: false
      }] as AudioModel[]
    }, {
      id: 1,
      answer: null,
      audios: [{
        filename: 'audio-a',
        ref: useRef({}),
        src: '/test/A Himitsu - Lost Within.mp3',
        isPlaying: false,
        selected: false
      }, {
        filename: 'audio-b',
        ref: useRef({}),
        src: '/test/Hinkik A Himitsu - Realms.mp3', // /test/Hinkik A Himitsu - Realms.mp3
        isPlaying: false,
        selected: false
      }] as AudioModel[]
    }]
  }));

  const [survey] = useState(observable([
    {type: 0, question: 'Text test'},
    {type: 1, question: 'Radio test', options: ['1', '2', '3']},
    {type: 2, question: 'Checkbox test', options: ['a', 'b', 'c']},
  ]));

  return (
    <Grid container spacing={3} direction="column">
      <Grid item xs={12}><Typography variant="h2" gutterBottom>
        Audio AB Test: {'example 1'}
      </Typography>
        <SurveyCard items={survey}/>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="A survey before the tests"/>
          <CardContent>
            <Typography>{theTest.survey}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {theTest.examples.map((ex, i) =>
        <Grid item xs={12} key={ex.id}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1a-content">
              {ex.answer && <Icon>check</Icon>}
              <Typography variant="h6" style={{marginLeft: 8}}>Example {i + 1}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={3}>
                <AudioController audios={ex.audios}/>
                <AudioExampleRadio example={ex}/>
              </Grid>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" color="primary">Next</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container justify="flex-end">
          <Button variant="contained" color="primary">Submit</Button>
        </Grid>
      </Grid>
    </Grid>
  )
})
