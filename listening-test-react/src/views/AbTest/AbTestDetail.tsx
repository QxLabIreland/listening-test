import React, {useContext, useEffect, useState} from "react";
import {useHistory, useParams} from 'react-router';
import Grid from "@material-ui/core/Grid";
import Icon from "@material-ui/core/Icon";
import {CardContent, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {FileDropZone} from "../../shared/components/FileDropZone";
import {observable} from "mobx";
import {observer} from "mobx-react";
import CardHeader from "@material-ui/core/CardHeader";
import {SurveySetUpView} from "../components/SurveySetUpView";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../shared/components/Loading";
import {AppBarTitle, GlobalDialog} from "../../shared/ReactContexts";
import TagsGroup from "../../shared/components/TagsGroup";
import {useScrollToView} from "../../shared/ReactHooks";

export const AbTestDetail = observer(function () {
  const {id} = useParams();
  const [tests, setTests] = useState<AbTestModel>(null);
  const [isError, setIsError] = useState(false);
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  // Scroll properties
  const {viewRef, scrollToView} = useScrollToView();

  useEffect(() => {
    // If it is edit page, get data from back end
    if (+id !== 0) Axios.get<AbTestModel>('/api/ab-test', {params: {_id: id}})
      // Successful callback
      .then((res) => setTests(observable(res.data)),
        () => setIsError(true));
    // If in creation page
    else setTests(observable({name: '', description: '', examples: [], survey: []}));
    // TODO Clean up and auto save
    return () => {};
  }, []);

  function addExample() {
    tests.examples.push({question: 'Briefly comment on your choice.', audios: [null, null]});
    scrollToView();
  }

  function deleteExample(index) {
    tests.examples.splice(index, 1);
  }

  const handleSubmit = () => {
    Axios.request({
      method: +id === 0 ? 'POST' : 'PUT', url: '/api/ab-test', data: tests
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
          <Grid item xs={12} key={i} ref={viewRef}>
            <Card>
              <CardHeader title={
                <div style={{display: 'flex'}}>Example {i + 1}
                  <TagsGroup tags={v.tags} onChange={newTags => v.tags = newTags}/>
                  <span style={{flexGrow: 1}}/>
                  <IconButton size="small" onClick={() => deleteExample(i)}><Icon>delete</Icon></IconButton>
                </div>
              }/>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField fullWidth variant="filled" name={'Question' + i} label="Question for this example"
                               value={v.question} onChange={event => v.question=event.target.value}/>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FileDropZone fileModel={v.audios[0]} onChange={fm=>v.audios[0]=fm} value="A"/>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <FileDropZone fileModel={v.audios[1]} onChange={fm=>v.audios[1]=fm} value="B"/>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FileDropZone fileModel={v.audioRef} onChange={fm=>v.audioRef=fm}
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
