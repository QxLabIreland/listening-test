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
import Axios from "axios";
import {UserModel} from "../../shared/models/UserModel";
import {LinkedTextRender} from "../../shared/components/RenderSurveyControl";

const useStyles = makeStyles((_: Theme) => ({
  drawerPaper: {width: 300},
  messageContent: {wordWrap: 'break-word'}
}));
const container = window !== undefined ? () => document.body : undefined;

export function NotificationDrawer() {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [messages, setMessages] = useState<MessageModel[]>();
  const classes = useStyles();
  // Initialization for messages
  useEffect(getMessage, []);

  const handleNotificationToggle = () => setNotificationOpen((prev) => {
    if (prev) {
      messages.forEach(v => v.unRead = false);
      Axios.patch('/api/messages').then();
    } else getMessage();
    return !prev;
  });

  function getMessage() {
    Axios.get<UserModel>('/api/messages').then(res => setMessages(observable(res.data.messages)));
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
      <List data-testid="messageList">
        {messages?.map(v => <React.Fragment key={v.id}>
          <ListItem className={classes.messageContent}>
            <ListItemText primary={
              v.unRead ? <strong><LinkedTextRender content={v.content}/></strong> :
                <span><LinkedTextRender content={v.content}/></span>
            } secondary={<span style={{float: 'right'}}>{new Date(v.createdAt?.$date).toLocaleString()}</span>}/>
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
