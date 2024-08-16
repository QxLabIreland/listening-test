import Axios from 'axios';
import 'mobx-react/batchingForReactDom';
import React from 'react';
import { createRoot } from 'react-dom/client';

import AppRoot from './AppRoot';
import './index.css';
import * as serviceWorker from './serviceWorker';

Axios.defaults.withCredentials = true;
Axios.defaults.xsrfHeaderName = 'X-CSRFToken';
Axios.defaults.xsrfCookieName = '_xsrf';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AppRoot />
  </React.StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
