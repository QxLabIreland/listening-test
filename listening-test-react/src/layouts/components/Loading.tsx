import React from "react";
import {CircularProgress, Typography} from "@material-ui/core";
import {Alert, AlertTitle} from "@material-ui/lab";

export default class Loading extends React.Component<{ error?: boolean, message?: string}> {
  render() {
    const {error, message} = this.props;

    const errorNode = <Alert severity="error">
      <AlertTitle>Something bad happened</AlertTitle>
      {`${message}. Please try again`}
    </Alert>

    const loadingNode = <React.Fragment>
      <CircularProgress/>
      <Typography style={{
        marginLeft: 16,
      }}>Loading...</Typography>
    </React.Fragment>

    return (
      <div style={{
        minHeight: 320,
        maxWidth: 480,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}>
        {error ? errorNode : loadingNode}
      </div>
    );
  }
}
