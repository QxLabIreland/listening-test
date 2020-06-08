import React from "react";
import {CircularProgress} from "@material-ui/core";

export default class Loading extends React.Component{
  render() {
    return (
      <div>
        <CircularProgress />
        Loading...
      </div>
    );
  }
}
