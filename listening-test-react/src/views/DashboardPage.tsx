import React, {useContext, useState} from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import Axios from "axios";
import {CurrentUser} from "../shared/ReactContexts";

export default function DashboardPage() {
  const [sent, setSent] = useState(false);
  const handleResend = () => Axios.put('/api/dashboard').then(() => setSent(true));
  const {currentUser} = useContext(CurrentUser);

  return <Grid container spacing={3}>
    <Grid item xs>
      <Card>
        <CardHeader title="Welcome back"/>
        <CardContent>
          <Typography>
            Welcome to Go Listen! This page is under construction but you can choose an option from the side menu to create a test
          </Typography>
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          {/*<Button color="primary">OK</Button>*/}
        </CardActions>
      </Card>
    </Grid>
    {!currentUser?.activated && <Grid item xs={12}>
      <Alert severity='info'
             action={<Button onClick={handleResend} disabled={sent}>{sent ? 'Sent' : 'Resend'}</Button>}>
        <AlertTitle>Please confirm your email address</AlertTitle>
        Please check the link which has been sent to your email address. Or you can send another one.
      </Alert>
    </Grid>}
  </Grid>
}
