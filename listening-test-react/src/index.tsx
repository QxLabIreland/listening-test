import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from "./App";
import 'mobx-react/batchingForReactDom'
import Axios from "axios";
import {createMuiTheme} from "@material-ui/core";
import {red} from "@material-ui/core/colors";

Axios.defaults.withCredentials = true;
Axios.defaults.xsrfHeaderName = "X-CSRFToken";
Axios.defaults.xsrfCookieName = "_xsrf";

const theme = createMuiTheme({
  palette: {
    warning: {
      main: red[500],
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
