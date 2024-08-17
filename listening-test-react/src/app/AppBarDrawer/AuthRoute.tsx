import React, { PropsWithChildren, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { CurrentUser } from '../../shared/ReactContexts';
import Loading from '../../shared/components/Loading';
import { AppPermissions } from '../../shared/enums/permissions';

export default function AuthRoute(props: PropsWithChildren<{ permission?: AppPermissions }>) {
  const { children, permission } = props;
  const { currentUser } = useContext(CurrentUser);
  const location = useLocation();
  // If current is undefined (data haven't come yet)
  if (currentUser === undefined) return <Loading />;

  // No permission given, only valid if the user is logged in
  if (!permission)
    return !!currentUser ? children : <Navigate replace to={{ pathname: '/sign-in' }} state={{ from: location }} />;

  // If user has permission to this page
  return currentUser?.permissions?.includes(permission) ? (
    children
  ) : (
    <Navigate replace to={{ pathname: '/user' }} state={{ from: location }} />
  );
}

export function useUserAuthResult(permission?: AppPermissions) {
  const { currentUser } = useContext(CurrentUser);

  // No permission given, only valid if the user is logged in
  if (!permission) return !!currentUser;
  // If user has permission to this page
  else return currentUser?.permissions?.includes(permission);
}
