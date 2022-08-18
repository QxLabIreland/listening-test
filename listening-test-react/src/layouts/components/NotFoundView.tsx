import React from 'react';
import {createStyles, Grid, Theme, Typography} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: theme.spacing(4)
  },
  content: {
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  }
}));

export default function NotFound() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container justifyContent="center" spacing={4}>
        <Grid item lg={6} xs={12} className={classes.content}>
          <Typography variant="h2">
            404: The page you are looking for isn’t here
          </Typography>
          <Typography variant="subtitle2">
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>
          <img alt="Under development" className={classes.image} src="/images/undraw_page_not_found_su7k.svg"/>
        </Grid>
      </Grid>
    </div>
  );
};
