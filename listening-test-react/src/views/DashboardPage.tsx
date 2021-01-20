import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Link, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import Axios from "axios";
import {CurrentUser} from "../shared/ReactContexts";
import {useUserAuthResult} from "../layouts/components/AuthRoute";
import {Link as RouterLink} from "react-router-dom";

interface StatisticModel {
  userNumber: number;
  responsesNumber: number;
  testsNumber: number
}

export default function DashboardPage() {
  return <Grid container spacing={3}>
    <Grid item xs={12}><Card>
      <CardHeader title="Welcome back"/>
      <CardContent>
        {/*<Typography>
            Welcome to Go Listen! This page is under construction but you can choose an option from the side menu to create a test
          </Typography>*/}
        <Typography>
          The markdown syntax (Rich Text) has been added to our website. Now you can use rich text for description,
          radio buttons or checkbox questions. You can also add image by providing img url.
          <br/> For example: ![alt
          text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png).
          <br/> Please check here for <Link href="https://commonmark.org/help/" target="_blank">How to Use
          Markdown</Link>
        </Typography>
      </CardContent>
      <CardActions style={{justifyContent: 'flex-end'}}/>
    </Card></Grid>
    <Grid item xs={12}><Card>
      <CardHeader title="New updates"/>
      <CardContent>
        <Typography>
          Golisten recently introduced storage limit for each user, you can check your usage by clicking your name on
          the upper right, and then you can check storage status in settings page. Or you can just click
          here <Link to="/user/settings" component={RouterLink}>Settings</Link>
        </Typography>
      </CardContent>
    </Card></Grid>
    <StatisticCard/>
    <ResendActivationEmailCard/>
  </Grid>
}

function StatisticCard() {
  const [statistic, setStatistics] = useState<StatisticModel>();
  const userPermission = useUserAuthResult('User');
  useEffect(() => {
    if (userPermission) Axios.get<StatisticModel>('/api/dashboard').then(res => setStatistics(res.data));
  }, []);

  if (userPermission && statistic) return <Grid item xs><Card>
    <CardHeader title="Golisten statistics"/>
    <CardContent>
      <Typography>Total registered test creators: {statistic.userNumber}</Typography>
      <Typography>Total number of subject responses: {statistic.responsesNumber}</Typography>
      <Typography>Total number of tests: {statistic.testsNumber}</Typography>
    </CardContent>
  </Card></Grid>;
  else return null;
}

function ResendActivationEmailCard() {
  const [sent, setSent] = useState(false);
  const {currentUser} = useContext(CurrentUser);

  const handleResend = () => Axios.put('/api/dashboard').then(() => setSent(true));

  if (!currentUser?.activated) return <Grid item xs={12}>
    <Alert severity="info" action={<Button onClick={handleResend} disabled={sent}>{sent ? 'Sent' : 'Resend'}</Button>}>
      <AlertTitle>Please confirm your email address</AlertTitle>
      Please check the link which has been sent to your email address. If you didn't see the link you can
      click the button send another one.
    </Alert>
  </Grid>
  else return null;
}
