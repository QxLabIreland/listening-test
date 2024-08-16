import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Box, Tab, Tabs } from '@mui/material';

import { TestDetailViewWrapper } from '../../components/ComponentsOverrider';
import { AppBarTitle } from '../../shared/ReactContexts';
import { TestUrl } from '../../shared/enums/test-urls';
import ResponseListView from '../test-responses/ResponseListView';

const RESPONSE_URL = '#responses';

export default function TestTabPage(props: { testUrl: TestUrl; testName: string }) {
  const { testUrl, testName } = props;
  // Hash of location, switch to response tab. url -> value -> title
  const location = useLocation();
  const [value, setValue] = React.useState<number>(location.hash === RESPONSE_URL ? 1 : 0);
  const { id } = useParams();
  const navigate = useNavigate();
  const { setTitle } = useContext(AppBarTitle);
  // This is the state for triggering useEffect
  const [preSetValue, setPreSetValue] = useState<boolean>(null);

  // Run when value is changed and first mount
  useEffect(() => {
    // Set correct value based on url
    setValue(location.hash === RESPONSE_URL ? 1 : 0);
    setTitle(
      +id === 0 ? `New ${testName}` : location.hash !== RESPONSE_URL ? `Edit ${testName}` : `${testName} Responses`,
    );
  }, [id, preSetValue]);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    navigate({ hash: newValue === 1 ? RESPONSE_URL : null });
    // Because prompt block cannot block code here. So we need do this in useEffect callback.
    setPreSetValue(!preSetValue);
  };

  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleTabChange} indicatorColor="primary" textColor="primary" centered>
        <Tab label="Questions" />
        <Tab label="Responses" disabled={id === '0'} />
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <TestDetailViewWrapper testUrl={testUrl} />}
        {value === 1 && <ResponseListView testUrl={testUrl} />}
      </Box>
    </React.Fragment>
  );
}
