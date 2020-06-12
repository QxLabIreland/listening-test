import React, {useContext} from "react";
import Axios from "axios";
import {CurrentUserContext} from "../ReactContexts";

Axios.defaults.withCredentials = true;
Axios.defaults.xsrfHeaderName = "X-CSRFToken";
Axios.defaults.xsrfCookieName = "_xsrf";

export default function XsrfAuth() {
  const {setUser} = useContext(CurrentUserContext);

  Axios.get('/api/login').then((res) => setUser(res.data));
  return <React.Fragment/>
}
