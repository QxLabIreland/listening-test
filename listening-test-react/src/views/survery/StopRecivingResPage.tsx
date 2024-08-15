import React from 'react';

import { Box, Grid, Icon, Theme, Typography } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  paragraph: {marginBottom: theme.spacing(4)},
  paragraphCenter: {marginBottom: theme.spacing(4), textAlign: 'center'},
}))

export function StopReceivingResPage() {
  const classes = useStyles();

  return <Box mt={8}>
    <Grid container justifyContent="center" alignItems="center" direction="column">
      <Box m={2}>
        <Icon fontSize="large">not_interested</Icon>
      </Box>
      <Typography variant="h5" className={classes.paragraph}>
        This test is no longer accepting responses.
      </Typography>
      <Typography color="textSecondary" className={classes.paragraphCenter}>
        Please try other links or contact the test owner
      </Typography>
    </Grid>
  </Box>
}
