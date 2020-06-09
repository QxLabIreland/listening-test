import React from "react";
import {CircularProgress, Icon, Typography} from "@material-ui/core";

export default class Loading extends React.Component<{error?: boolean, message?: string}>{
  render() {

    const error = <React.Fragment>
      <Icon fontSize="large">error</Icon>
      <Typography style={{marginLeft: 16,}}>
        {this.props['message'] ? this.props['message'] : 'Something bad happened'}
      </Typography>
    </React.Fragment>

    const loading = <React.Fragment>
      <CircularProgress />
      <Typography style={{
        marginLeft: 16,
      }}>Loading...</Typography>
    </React.Fragment>

    return (
      <div style={{
        height: 240,
        width: 240,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto'
      }}>
        {this.props['error'] ? error : loading}
      </div>
    );
  }
}
