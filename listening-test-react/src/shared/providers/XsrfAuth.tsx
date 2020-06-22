import React, {useContext, useEffect} from "react";
import Axios from "axios";
import {CurrentUser, GlobalDialog} from "../ReactContexts";

Axios.defaults.withCredentials = true;
Axios.defaults.xsrfHeaderName = "X-CSRFToken";
Axios.defaults.xsrfCookieName = "_xsrf";

export default function XsrfAuth() {
  const {setUser} = useContext(CurrentUser);
  const openDialog = useContext(GlobalDialog);

  useEffect(() => {
    Axios.get('/api/login').then((res) => setUser(res.data), (err => {
      console.log(err.response)
      openDialog(err.response.statusText, 'Server Error')
    }));
  }, []);

  return <React.Fragment/>
}
