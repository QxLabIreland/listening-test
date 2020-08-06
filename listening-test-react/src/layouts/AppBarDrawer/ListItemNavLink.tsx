import {NavLink, useLocation} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import React, {PropsWithChildren, useEffect, useState} from "react";
import {useTheme} from "@material-ui/core/styles";
import {useUserAuthResult} from "../../shared/ReactHooks";

export function ListItemNavLink (props: PropsWithChildren<any>) {
  const {to, icon, permission, ...rest} = props;
  const [selected, setSelected] = useState(false)
  // Get pathname and current to
  const {pathname} = useLocation();
  const theme = useTheme();

  useEffect(() => {
    // Render check firstly. exact attribute means if the url is exactly same as to attribute.
    setSelected(pathname.includes(to));
  }, [to, pathname]);

  const userAuthResult = useUserAuthResult(permission);
  // Check if user has enough permission to show the menus
  if (!userAuthResult) return null;

  return (
    <ListItem button component={NavLink} to={to} selected={selected} {...rest}
              activeStyle={{color: theme.palette.primary.main}}>
        <span style={{minWidth: 40}}>
          <Icon>{icon}</Icon>
        </span>
      <ListItemText primary={props.children}/>
    </ListItem>
  )
}
