import React from 'react';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@material-ui/core";

export default function DashboardPage() {
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
          <Button color="primary">OK</Button>
        </CardActions>
      </Card>
    </Grid>
    {/*<Grid item xs={12} md={6}>
      <Card>
        <CardHeader title="MUSHRA Test"/>
        <CardContent>

        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button color="primary">Check</Button>
        </CardActions>
      </Card>
    </Grid>*/}
  </Grid>
}
