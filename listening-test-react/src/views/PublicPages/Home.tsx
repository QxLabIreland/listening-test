import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      Copyright © Listening Test {new Date().getFullYear()}.
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    color: 'white'
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
  },
  background: {
    backgroundImage: 'url(/images/wolfgang-hasselmann-hym0ngq6IbY-unsplash.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'auto'
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">
        <Typography variant="h2" component="h1" gutterBottom>
          Hello there!
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Conduct listening test and collect information in an easy way!<br/>

        </Typography>
        <Typography variant="body1">Click sign in to start your tests.</Typography>
        <Typography variant="body2"><small>Photo by Wolfgang Hasselmann on Unsplash</small></Typography>
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">by QxLab at University College Dublin</Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
}
