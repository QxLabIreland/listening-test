import 'mobx-react/batchingForReactDom'
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Loading from "./shared/components/Loading";
import MainLayout from "./layouts/MainLayout";
import AppBarDrawer from "./layouts/AppBarDrawer";
import TaskContainer from "./layouts/TaskContainer";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route path='/task' component={TaskContainer}/>
                    {/*Dashboard administration pages*/}
                    <Route path="/user" component={AppBarDrawer}/>
                    {/*Outside pages*/}
                    <Route path="/" component={MainLayout}/>
                </Switch>
            </Suspense>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
