import {NavLink, useLocation, useRouteMatch} from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import React, {useEffect, useState} from "react";
import {useTheme} from "@material-ui/core/styles";

export default function ListItemNavLink(props: any) {
  const {to, icon, ...rest} = props;
  const [selected, setSelected] = useState(false)
  // Get pathname and current to
  const {pathname} = useLocation();
  const {path} = useRouteMatch();
  const theme = useTheme();

  useEffect(() => {
    // Render check firstly. exact attribute means if the url is exactly same as to attribute.
    return setSelected(pathname.includes(to));
  }, [path, to, pathname])

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
