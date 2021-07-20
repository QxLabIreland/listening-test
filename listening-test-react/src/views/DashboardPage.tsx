import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Link, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";
import Axios from "axios";
import {CurrentUser} from "../shared/ReactContexts";
import {useUserAuthResult} from "../layouts/components/AuthRoute";
import {Link as RouterLink} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

interface StatisticModel {
  userNumber: number;
  responsesNumber: number;
  testsNumber: number
}

const useStyles = makeStyles(() => ({
  header: {marginTop: 24, marginBottom:8},
}));

export default function DashboardPage() {
  return <Grid container spacing={3}>
    <Grid item xs={12}><Card>
      <CardHeader title="Welcome back"/>
      <CardContent>
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
    <ResendActivationEmailCard/>
    <StatisticCard/>
    <AboutCard/>
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

function AboutCard() {
  const classes = useStyles();
  return <Grid item xs={12}>
    <Card>
      <CardHeader title="About The App"/>
      <CardContent>
        <Typography>
          Go Listen was created by{' '}
          <Link href="https://www.linkedin.com/in/qijian-zhang-1112a217b/" target="_blank">Qijian Zhang</Link>,{' '}
          <Link href="https://www.linkedin.com/in/dan-barry/" target="_blank">Dan Barry</Link> and{' '}
          <Link href="https://www.linkedin.com/in/andrew-hines/" target="_blank">Andrew Hines</Link> at{' '}
          <Link href="https://qxlab.ucd.ie/" target="_blank">QxLab</Link> in{' '}
          <Link href="https://www.ucd.ie/cs/" target="_blank">University College Dublin</Link>.
          The app is free to use including commercial use. Each user is given 500 MB of audio storage
          but if you need more email us using the details below.
          If you have found the app useful, please cite the app using the citation below.
        </Typography>

        <Typography variant="h5" className={classes.header}>Contact Us</Typography>
        <Typography>
          golisten@ucd.ie
        </Typography>

        <Typography variant="h5" className={classes.header}>Preferred Citation</Typography>
        <Typography>
          Barry, D., Zhang, Q., Sun, P.W. and Hines, A., 2021. Go Listen: An End-to-End Online Listening Test Platform. Journal of Open Research Software, 9(1), p.20. DOI: http://doi.org/10.5334/jors.361
        </Typography>

        <Typography variant="h5" className={classes.header}/>
        <code>
          article{'{'}zhang_barry_sun_hines_2021,
          title={'{'}Go Listen: An End-to-End Online Listening Test Platform{'}'},
          journal={'{'}Journal of Open Research Software{'}'},
          author={'{'}Dan Barry and Qijian Zhang and Pheobe Wenyi Sun and Andrew Hines{'}'},
          doi={'{'}10.5334/jors.361{'}'},
          url={'{'}http://doi.org/10.5334/jors.361{'}'},
          year={'{'}2021{'}'}
          {'}'}
        </code>

        <Typography variant="h5" className={classes.header}>Source Code</Typography>
        <Typography>
          https://github.com/QxLabIreland/listening-test
        </Typography>
      </CardContent>
    </Card>
  </Grid>
}
