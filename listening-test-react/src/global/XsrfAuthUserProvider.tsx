import Axios from 'axios';
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';

import { CurrentUser, GlobalDialog } from '../shared/ReactContexts';
import { UserModel } from '../shared/models/UserModel';

export default function XsrfAuthUserProvider(props: PropsWithChildren<any>) {
  const [currentUser, setCurrentUser] = useState<UserModel>();
  const openDialog = useContext(GlobalDialog);

  useEffect(() => {
    Axios.get('/api/login').then(
      res => {
        // Check if the data is UserModel
        if (res.data.hasOwnProperty('email') && res.data.hasOwnProperty('name')) setCurrentUser(res.data);
        else setCurrentUser(null);
      },
      err => {
        setCurrentUser(null);
        openDialog(err.response.data, 'Server Error');
      },
    );
  }, []);

  return <CurrentUser.Provider value={{ currentUser, setCurrentUser }}>{props.children}</CurrentUser.Provider>;
}
