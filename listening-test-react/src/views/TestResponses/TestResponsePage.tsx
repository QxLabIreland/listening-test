import React, {Suspense} from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme} from "@material-ui/core";
import TestResponseView from "./TestResponseView";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {Link} from "react-router-dom";
import {Redirect, Route, Switch, useRouteMatch} from "react-router";
import Loading from "../../shared/components/Loading";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    fabGreen: {
      color: theme.palette.common.white,
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
    },
  }),
);

export default function () {
  const {path} = useRouteMatch();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => setValue(newValue)
  return (
    <React.Fragment>
      <Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" centered>
        <Tab component={Link} to={`${path}/ab-test`} label="AB Test"/>
        <Tab component={Link} to={`${path}/mashura`} label="MUSHRA Test"/>
      </Tabs>
      <Box paddingTop={2}>
        <Suspense fallback={<Loading/>}>
          <Switch>
            <Redirect exact from={`${path}`} to={`${path}/ab-test`}/>
            <Route exact path={`${path}/ab-test`}>
              <TestResponseView/>
            </Route>

          </Switch>
        </Suspense>
      </Box>
      <Fab color="primary" aria-label="add" className={classes.fab}>
        <Icon>add</Icon>
      </Fab>
    </React.Fragment>
  )
}
