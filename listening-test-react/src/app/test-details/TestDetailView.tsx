import Axios from 'axios';
import { observer } from 'mobx-react';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

import { axiosErrorHandler, globalStore } from '../../global/globalStore';
import { GlobalDialog } from '../../shared/ReactContexts';
import Loading from '../../shared/components/Loading';
import Prompt from '../../shared/components/Prompt';
import { TestUrl } from '../../shared/enums/test-urls';
import { BasicTaskItemModel, BasicTaskModel } from '../../shared/models/BasicTaskModel';
import TestDetailItemCardList from './TestDetailItemCardList';
import DetailViewActions from './actions-bar/DetailViewActions';
import { testDetails } from './test-details-store';

export default observer(function TestDetailView({
  testUrl,
  id,
  ButtonGroup,
}: {
  testUrl: TestUrl;
  id: string;
  ButtonGroup: FunctionComponent<{ onAdd: (type: BasicTaskItemModel) => void }>;
}) {
  const navigate = useNavigate();
  const openDialog = useContext(GlobalDialog);
  const location = useLocation();

  useEffect(() => {
    // If it is edit page, get data from back end. If there is value in location.state, we gonna use a template
    if (location.state || id !== '0')
      Axios.get<BasicTaskModel>('/api/' + testUrl, { params: { _id: location.state || id } }).then(({ data }) => {
        if (location.state) testDetails.fetchFromTemplate(data, testUrl);
        testDetails.fetchData(data);
      }, testDetails.fetchErrored);
    // If in creation page
    else testDetails.createNew(testUrl);

    return testDetails.reset();
  }, [id, testUrl, location.state]);

  const requestServer = (isNew: boolean) => {
    // Request server based on is New or not.
    Axios.request({
      method: isNew ? 'POST' : 'PUT',
      url: '/api/' + testUrl,
      data: testDetails.data,
    })
      .then(() => {
        testDetails.save();
        globalStore.showSnackbar('Save successfully', 'success');
      })
      .then(() => navigate('./../'))
      .catch(axiosErrorHandler);
  };
  const handleSubmit = () => {
    // Create a new text or modify current test
    if (id === '0') requestServer(true);
    else
      Axios.get('/api/response-count', { params: { testId: id, testType: testUrl } }).then(res => {
        // After checking with server, if there are responses, it will create a new test.
        if (res.data > 0)
          openDialog(
            'This test has already accepted some responses. Tap Save to create a new duplicate of this test. You can delete old one if you require.',
            'Reminder',
            null,
            () => requestServer(true),
          );
        else requestServer(false);
      });
  };
  // Local methods
  const addItem = (newItem: BasicTaskItemModel) => testDetails.data.items.push(newItem);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center" id="containerTestDetailItemCardList">
      <Prompt when={testDetails.isChanged} />
      {testDetails.data ? (
        <>
          <DetailViewActions testUrl={testUrl} handleSubmit={handleSubmit} />
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Test Name"
              fullWidth
              value={testDetails.data.name}
              name="name"
              onChange={e => testDetails.update({ name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              label="Test Description"
              maxRows={8}
              multiline
              fullWidth
              value={testDetails.data.description}
              name="description"
              onChange={e => testDetails.update({ description: e.target.value })}
            />
          </Grid>
          <TestDetailItemCardList testUrl={testUrl} />
          <Grid item container justifyContent="center" xs={12}>
            <ButtonGroup onAdd={addItem} />
          </Grid>
        </>
      ) : (
        <Grid item>
          <Loading error={testDetails.error?.response?.data as string} />
        </Grid>
      )}
    </Grid>
  );
});
