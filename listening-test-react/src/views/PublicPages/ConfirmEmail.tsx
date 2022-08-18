import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Axios from "axios";
import {Box, Grid, Icon, Typography} from "@material-ui/core";
import Loading from "../../layouts/components/Loading";

export default function () {
  const location = useLocation();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.search) Axios.get('/api/sign-up', {params: {
        confirmationCode: location.search.replace('?', '')
      }}).then(() => setLoading(false), reason => setError(reason.response.data));
  }, [location.search]);

  return <Box mt={8}>
    <Grid container justifyContent="center" alignItems="center" direction="column">
      {!loading ? <>
        <Box m={2}>
          <Icon fontSize="large">check_circle_outline</Icon>
        </Box>
        <Typography variant="body1">
          Your email has been confirmed
        </Typography>
      </> : <Loading error={error}/>}
    </Grid>
  </Box>
}
