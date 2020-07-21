import React from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@material-ui/core";

export default function DashboardPage() {
  return <Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h5">
        New Responses:
      </Typography>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardHeader title="AB Test"/>
        <CardContent>

        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button color="primary">Check</Button>
        </CardActions>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardHeader title="MUSHRA Test"/>
        <CardContent>

        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button color="primary">Check</Button>
        </CardActions>
      </Card>
    </Grid>
  </Grid>
}
