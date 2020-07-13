import React from "react";
import {Box, Grid, Icon, Typography} from "@material-ui/core";

export default function SurveyFinishPage() {

  return <Box mt={8}><Grid container justify="center" alignItems="center" direction="column">
    <Box m={2}>
      <Icon fontSize="large">check_circle_outline</Icon>
    </Box>
    <Typography>
      Thanks for your submitting! You can close this page now.
    </Typography>

  </Grid></Box>;
}
