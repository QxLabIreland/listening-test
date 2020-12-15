import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {Button, Dialog} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => createStyles({
  main: {
    marginTop: '10vh',
    marginBottom: '10vh',
    color: 'white'
  },
  small: {fontSize: '0.75rem'},
  mail: {color: theme.palette.primary.contrastText},
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor: theme.palette.grey[800],
      // theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    color: theme.palette.grey["50"]
  },
  background: {
    // Background
    backgroundColor: 'black',// theme.palette.background.default,
    backgroundImage: 'url(/images/homepage.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'auto',
    // Layout
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end'
  },
  seeDemo: {background: 'linear-gradient(45deg, #2991ff 30%, #ff005b 90%)', color: 'white'},
  demoFrame: {width: 'calc(100vw - 64px)', maxWidth: 960, height: 'calc((100vw - 64px) * 0.5625)', maxHeight: 540}
}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <CssBaseline />
      <Typography align="center"><SimpleDialog/></Typography>

      <Container component="main" className={classes.main} maxWidth="md">
        <Typography variant="h2" component="h1" gutterBottom align="center" style={{fontWeight: 800}}>
          Go Listen!
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Create and share a subjective listening test in a few minutes<br/>

        </Typography>
        {/*<Typography variant="body2" gutterBottom align="center" className={classes.small}>
          We are in closed beta! Contact <a href="mailto:golisten@ucd.ie" className={classes.mail}>golisten@ucd.ie</a> to discuss access
        </Typography>*/}

      </Container>
      {/*<footer className={classes.footer}>
        <Container maxWidth="md">
          <Typography variant="body1">by QxLab at University College Dublin</Typography>
          <Typography variant="body2" gutterBottom>
            <small>
              <span>Photo by Tanner Boriack on Unsplash</span>
            </small>
          </Typography>
          <Typography variant="body2" color="inherit">
            Copyright © Go Listen {new Date().getFullYear()}.
          </Typography>
        </Container>
      </footer>*/}
    </div>
  );
}

function SimpleDialog() {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  }

  return <>
    <Button variant={"contained"} className={classes.seeDemo} onClick={handleOpen}>See a demo</Button>
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} maxWidth="md">
      <iframe title="demo" className={classes.demoFrame} src="https://www.youtube.com/embed/xd37rCfvA-4" frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
    </Dialog>
  </>
}
