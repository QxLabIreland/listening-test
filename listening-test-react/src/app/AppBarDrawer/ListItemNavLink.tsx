import React, { PropsWithChildren, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Icon, ListItemButton, ListItemButtonProps, ListItemText } from '@mui/material';

import { useUserAuthResult } from './AuthRoute';
import { AppPermissions } from '../../shared/enums/permissions';

export function ListItemNavLink(
  props: PropsWithChildren<ListItemButtonProps & { to: string; icon: string; permission?: AppPermissions }>,
) {
  const { to, icon, permission, ...rest } = props;
  const [selected, setSelected] = useState(false);
  // Get pathname and current to
  const { pathname } = useLocation();

  useEffect(() => {
    // Render check firstly. exact attribute means if the url is exactly same as to attribute.
    setSelected(pathname.includes(to));
  }, [to, pathname]);

  const userAuthResult = useUserAuthResult(permission);
  // Check if user has enough permission to show the menus
  if (!userAuthResult) return null;

  return (
    <ListItemButton component={NavLink} to={to} selected={selected} {...rest}>
      <span style={{ minWidth: 40 }}>
        <Icon>{icon}</Icon>
      </span>
      <ListItemText primary={props.children} />
    </ListItemButton>
  );
}
