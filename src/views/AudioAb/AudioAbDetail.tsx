import React, {useEffect, useState} from "react";
import {useParams} from 'react-router';
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import {CardContent, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FileDropZone from "../components/FileDropZone";
import {observable} from "mobx";
import {observer} from "mobx-react";
import CardHeader from "@material-ui/core/CardHeader";
import SurveySetUpView from "../components/SurveySetUpView";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../shared/components/Loading";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px dashed rgba(0, 0, 0, 0.3)'
  },
}));

export default observer(function () {
  const {id} = useParams();
  const classes = useStyles();
  const [tests, setTests] = useState<AbTestModel>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // If it is edit page, get data from back end
    if (+id !== 0) Axios.get<AbTestModel>('/api/user/ab-test', {params: {id: id}})
      .then((res) => setTests(observable(res.data)),
          () => setIsError(true));
    // If in creation page
    else setTests(observable({id: 0, examples: [], survey: []}));
  }, [id]);

  function addExample() {
    tests.examples.push({
      id: 0,
      audioA: {id: 0, filename: null, src: null},
      audioB: {id: 0, filename: null, src: null},
      audioRef: {id: 0, filename: null, src: null}
    })
  }

  function deleteExample(index) {
    tests.examples.splice(index, 1);
  }

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      <Grid item xs={12} style={{display: 'flex'}}>
        <span style={{flexGrow: 1}}/>
        <Button color="primary" variant="contained">
          Submit
        </Button>
      </Grid>
      {tests ? <React.Fragment>
        <Grid item xs={12}>
          <SurveySetUpView items={tests.survey}/>
        </Grid>
        {tests.examples.map((v, i) =>
          <Grid item xs={12} key={i}>
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
                  <Grid item xs={12} md={5} key={i}><FileDropZone classes={classes} file={v.audioA}/></Grid>
                  <Grid item xs={12} md={5} key={i}><FileDropZone classes={classes} file={v.audioB}/></Grid>
                  <Grid item xs={12} md={2} key={i}><FileDropZone classes={classes} file={v.audioRef}
                                                                  label="Reference"/></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item>
          <Button variant="outlined" color="primary" onClick={addExample}>Add an Audio Example</Button>
        </Grid>
      </React.Fragment> : <Grid item><Loading error={isError}/></Grid>}
    </Grid>
  )
})
