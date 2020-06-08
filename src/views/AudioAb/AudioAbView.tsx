import React, {useState} from "react";
import {useParams} from 'react-router';
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import {CardContent, TextField, Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FileDropZone from "../components/FileDropZone";
import {observable} from "mobx";
import {observer} from "mobx-react";
import CardHeader from "@material-ui/core/CardHeader";
import SurveySetUp from "../SurveySetUp/SurverySetUp";

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px dashed rgba(0, 0, 0, 0.3)'
  },
}));

export const AudioAbView = observer(() => {
  const {id} = useParams();
  const classes = useStyles();
  const a = [];
  a.push({id: 0, name: 'jake'});
  const [tests] = useState(observable([{
    id: 0,
    files: [
      {id: null, filename: null, src: null, ref: React.createRef()},
      {id: null, filename: null, src: null, ref: React.createRef()}
    ]
  }]));

  function addExample() {
    tests.push({
      id: 1,
      files: [
        {id: null, filename: null, src: null, ref: React.createRef()},
        {id: null, filename: null, src: null, ref: React.createRef()}
      ]
    })
  }

  function deleteExample(index) {
    tests.splice(index, 1);
  }

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item xs={12}>
        <SurveySetUp/>
      </Grid>
      {tests.map((v, i) =>
        <Grid item xs={12} key={v.id}>
          <Card>
            <CardHeader title={
              <div style={{display: 'flex'}}>Example {i + 1} <span style={{flexGrow: 1}}/>
                <IconButton size="small" onClick={() => deleteExample(i)}><Icon>delete</Icon></IconButton>
              </div>
            }/>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField fullWidth variant="filled" name={v.id + 'Question'} label="Question for this example"/>
                </Grid>
                {v.files.map((f, i) =>
                  <Grid item xs={6} key={i}><FileDropZone classes={classes} file={f}/></Grid>)}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
      <Grid item>
        <Button variant="outlined" color="primary" onClick={addExample}>Add an Audio Example</Button>
      </Grid>
    </Grid>
  )
})
