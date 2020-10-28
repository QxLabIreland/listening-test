import Drawer from "@material-ui/core/Drawer";
import React, {useEffect, useState} from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Badge, Divider} from "@material-ui/core";
import {MessageModel} from "../../shared/models/MessageModel";
import {observable} from "mobx";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((_: Theme) => ({
  drawerPaper: {width: 300},
}));
const container = window !== undefined ? () => document.body : undefined;

export function NotificationDrawer() {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [messages, setMessages] = useState<MessageModel[]>();
  const classes = useStyles();
  // Initialization for messages
  useEffect(getMessage, []);

  const handleNotificationToggle = () => setNotificationOpen((prev) => {
    if (prev) messages.forEach(v => v.unRead = false);
    else getMessage();
    return !prev;
  });
  function getMessage() {
    setMessages(observable([
      {
        _id: {$oid: '1'},
        unRead: false,
        content: 'A respondent has removed their response from **Test Name**. You should download the updated test data again.',
        createdAt: {$date: new Date('2020/10/28')}
      },
      {
        _id: {$oid: '2'},
        unRead: false,
        content: 'A respondent has removed their response from **Test Name**. You should download the updated test data again.',
        createdAt: {$date: new Date('2020/10/28')}
      }
    ] as MessageModel[]));
  }

  return <>
    <IconButton aria-label="notifications" color="inherit" onClick={handleNotificationToggle}>
      <Badge badgeContent={messages?.filter(v => v.unRead).length} color="secondary">
        <Icon>notifications</Icon>
      </Badge>
    </IconButton>
    <Drawer container={container} open={notificationOpen} onClose={handleNotificationToggle} variant="temporary"
            anchor="right"
            ModalProps={{keepMounted: true}} classes={{paper: classes.drawerPaper}}>
      {/*subheader={<ListSubheader>Notifications</ListSubheader>}*/}
      <List>
        {messages?.map(v => <React.Fragment key={v._id.$oid}>
          <ListItem>
            <ListItemText primary={v.unRead ? <strong>{v.content}</strong> : <span>{v.content}</span>}
                          secondary={<span style={{float: 'right'}}>{v.createdAt.$date.toDateString()}</span>}/>
          </ListItem>
          <Divider/>
        </React.Fragment>)}
        <ListItem>
          <ListItemText secondary="No more messages"/>
        </ListItem>
      </List>
    </Drawer>
  </>
}
