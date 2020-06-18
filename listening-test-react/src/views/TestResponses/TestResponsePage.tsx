import React, {Suspense} from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme, Tooltip} from "@material-ui/core";
import TestResponseView from "./TestResponseView";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";
import {Link} from "react-router-dom";
import {Redirect, Route, Switch, useRouteMatch} from "react-router";
import Loading from "../../shared/components/Loading";
import Axios from "axios";
import {AbSurveyPage} from "../AbTestSurvey/AbSurveyPage";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
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

  const handleDownload = () => {
    let testType = null;
    switch (value) {
      case 0: testType = 'abTest'; break;
      case 1: testType = 'mushra'; break;
      default: return
    }
    const uri = Axios.getUri({url: 'http://localhost:8888/api/response-download', params: {testType: testType}});
    // const uri = Axios.getUri({url: '/api/response-download', params: {testType: testType}})
    window.open(uri);
  }

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
              <TestResponseView testType="abTest" prefix="ab-test"/>
            </Route>
            <Route exact path={`${path}/ab-test/:id`}>
            </Route>

          </Switch>
        </Suspense>
      </Box>
      <Tooltip title="Download All Responses For This Section">
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={handleDownload}>
        <Icon>get_app</Icon>
      </Fab>
      </Tooltip>
    </React.Fragment>
  )
}
