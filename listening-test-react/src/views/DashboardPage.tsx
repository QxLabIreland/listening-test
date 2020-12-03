import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Link, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import Axios from "axios";
import {CurrentUser} from "../shared/ReactContexts";
import {useUserAuthResult} from "../layouts/components/AuthRoute";

interface StatisticModel {
  userNumber: number;
  responsesNumber: number;
  testsNumber: number
}

export default function DashboardPage() {
  const [sent, setSent] = useState(false);
  const {currentUser} = useContext(CurrentUser);
  const [statistic, setStatistics] = useState<StatisticModel>();
  useEffect(() => {
    Axios.get<StatisticModel>('/api/dashboard').then(res => setStatistics(res.data));
  }, []);
  const userPermission = useUserAuthResult('User');

  const handleResend = () => Axios.put('/api/dashboard').then(() => setSent(true));

  return <Grid container spacing={3}>
    <Grid item xs>
      <Card>
        <CardHeader title="Welcome back"/>
        <CardContent>
          {/*<Typography>
            Welcome to Go Listen! This page is under construction but you can choose an option from the side menu to create a test
          </Typography>*/}
          <Typography>
            The markdown syntax (Rich Text) has been added into our website. Now you can use rich text for description, radio buttons or checkbox questions.
            Please check here for <Link href="https://remarkjs.github.io/react-markdown/">How to use Markdown</Link>
          </Typography>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          {/*<Button color="primary">OK</Button>*/}
        </CardActions>
      </Card>
    </Grid>
    {statistic && userPermission && <Grid item xs>
      <Card>
        <CardHeader title="Golisten statistics"/>
        <CardContent>
          <Typography>Total registered test creators: {statistic.userNumber}</Typography>
          <Typography>Total number of subject responses: {statistic.responsesNumber}</Typography>
          <Typography>Total number of Tests: {statistic.testsNumber}</Typography>
        </CardContent>
      </Card>
    </Grid>}
    {!currentUser?.activated && <Grid item xs={12}>
      <Alert severity='info'
             action={<Button onClick={handleResend} disabled={sent}>{sent ? 'Sent' : 'Resend'}</Button>}>
        <AlertTitle>Please confirm your email address</AlertTitle>
        Please check the link which has been sent to your email address. Or you can send another one.
      </Alert>
    </Grid>}
  </Grid>
}
