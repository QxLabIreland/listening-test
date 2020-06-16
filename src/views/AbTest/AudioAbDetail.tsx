import React, {useContext, useEffect, useState} from "react";
import {useHistory, useParams} from 'react-router';
import Grid from "@material-ui/core/Grid";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import {CardContent, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {FileDropZone} from "../components/FileDropZone";
import {observable} from "mobx";
import {observer} from "mobx-react";
import CardHeader from "@material-ui/core/CardHeader";
import {SurveySetUpView} from "../components/SurveySetUpView";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../shared/components/Loading";
import {AppBarTitle, GlobalDialog} from "../../shared/ReactContexts";

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    border: '1px dashed rgba(0, 0, 0, 0.3)'
  },
}));

export const AudioAbDetail = observer(function () {
  const {id} = useParams();
  const classes = useStyles();
  const [tests, setTests] = useState<AbTestModel>(null);
  const [isError, setIsError] = useState(false);
  const {setTitle} = useContext(AppBarTitle);
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);

  useEffect(() => {
    setTitle(+id === 0 ? 'New AB Test' : 'AB Test: ' + id);
    // If it is edit page, get data from back end
    if (+id !== 0) Axios.get<AbTestModel>('/api/ab_test', {params: {_id: id}})
      // Successful callback
      .then((res) => setTests(observable(res.data)),
        () => setIsError(true));
    // If in creation page
    else setTests(observable({name: '', description: '', examples: [], survey: []}));
  }, [setTitle, id]);

  function addExample() {
    tests.examples.push({question: 'Briefly comment on your choice.', audioA: null, audioB: null});
  }

  function deleteExample(index) {
    tests.examples.splice(index, 1);
  }

  const handleSubmit = () => {
    Axios.request({
      method: +id === 0 ? 'POST' : 'PUT', url: '/api/ab_test', data: tests
    }).then(() => {
      history.push('./');
    }, reason => openDialog(reason.response.statusText, 'Something wrong'))
  }

  return (
    <Grid container spacing={3} justify="center" alignItems="center">
      {tests ? <React.Fragment>
        <Grid item xs={12} style={{display: 'flex'}}>
          <span style={{flexGrow: 1}}/>
          <Button color="primary" variant="contained" onClick={handleSubmit}>Save</Button>
        </Grid>
        <Grid item xs={12}>
          <TextField variant="outlined" value={tests.name} onChange={(e) => tests.name = e.target.value}
                     label="Test Name" fullWidth/>
        </Grid>
        <Grid item xs={12}>
          <TextField variant="outlined" label="Test Description" rowsMax={8} value={tests.description}
                     onChange={(e) => tests.description = e.target.value} multiline fullWidth/>

        </Grid>
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
                    <TextField fullWidth variant="filled" name={'Question' + i} label="Question for this example"/>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FileDropZone classes={classes} fileModel={v.audioA} onChange={fm=>v.audioA=fm}/>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FileDropZone classes={classes} fileModel={v.audioB} onChange={fm=>v.audioB=fm}/>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FileDropZone classes={classes} fileModel={v.audioRef} onChange={fm=>v.audioRef=fm}
                                  label="Reference"/></Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item>
          <Button variant="outlined" color="primary" onClick={addExample}><Icon>add</Icon>Add an Audio Example</Button>
        </Grid>
      </React.Fragment> : <Grid item><Loading error={isError}/></Grid>}
    </Grid>
  )
})

function useAjaxGet<T>(url: string, id: string) {
  const [data, setData] = useState<T>(null);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    Axios.get<T>(url, {withCredentials: true, params: {id}})
      .then((res) => setData(res.data), (reason) => setError(reason));
  }, [url, id])

  return {data, error}
}
