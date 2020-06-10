import React from "react";
import {Box, createStyles, Fab, Icon, Tab, Tabs, Theme} from "@material-ui/core";
import TestResponseView from "./TestResponseView";
import {makeStyles} from "@material-ui/core/styles";
import {green} from "@material-ui/core/colors";

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
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  return (
    <React.Fragment>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Item One"/>
        <Tab label="Item Two"/>
        <Tab label="Item Three"/>
      </Tabs>
      <Box paddingTop={2}>
        {value === 0 && <TestResponseView/>}
      </Box>
      <Fab color="primary" aria-label="add" className={classes.fab}>
        <Icon>add</Icon>
      </Fab>
    </React.Fragment>
  )
}
