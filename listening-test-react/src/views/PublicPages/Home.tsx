import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";


function Copyright() {
  return (
    <Typography variant="body2" color="inherit">
      Copyright © Golisten.io {new Date().getFullYear()}.
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  main: {
    marginTop: theme.spacing(16),
    // marginBottom: theme.spacing(8),
    color: 'white'
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.grey[800],
      // theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    color: theme.palette.grey["50"]
  },
  background: {
    backgroundImage: 'url(/images/homepage.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'auto',

    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column'
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom align="center" style={{fontWeight: 800}}>
          Golisten.io
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Create and share a subjective listening test in a few minutes<br/>

        </Typography>
        {/*<Typography variant="body1" gutterBottom align="center">Click sign in to start your tests.</Typography>*/}

      </Container>
      {/*<footer className={classes.footer}>
        <Container maxWidth="md">
          <Typography variant="body1">by QxLab at University College Dublin</Typography>
          <Typography variant="body2" gutterBottom>
            <small>
              <span>Photo by Tanner Boriack on Unsplash</span>
            </small>
          </Typography>
          <Copyright />
        </Container>
      </footer>*/}
    </div>
  );
}
