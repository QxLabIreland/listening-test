import Drawer from "@material-ui/core/Drawer";
import React, {useEffect, useState} from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Badge, Divider, Link} from "@material-ui/core";
import {MessageModel} from "../../shared/models/MessageModel";
import {observable} from "mobx";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Axios from "axios";
import {UserModel} from "../../shared/models/UserModel";

const useStyles = makeStyles((_: Theme) => ({
  drawerPaper: {width: 300},
  messageContent: {wordWrap: 'break-word'}
}));
const container = window !== undefined ? () => document.body : undefined;

const LinkedTextRender = function ({content}: { content: string }) {
  // const linkRegex = /\[([^\]]*)]\(([^)]*)\)/g;
  // https://google.com/ dfwr dafgqgf daf
  const linkRegex = /https?:\/\/(?:[^ ]+)/g;
  // Get all links in the description
  const links: RegExpExecArray[] = []
  let array1;
  while ((array1 = linkRegex.exec(content)) !== null) links.push(array1);
  // Get text except links
  const nonLinkTexts = content.split(linkRegex);
  // Build final style
  return <>{nonLinkTexts.map((value, index) => <React.Fragment key={index}>
    {value}{index < links.length && <Link href={links[index][0]} target="_blank">{links[index][0]}</Link>}
  </React.Fragment>)}</>;
}

export function NotificationDrawer() {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [messages, setMessages] = useState<MessageModel[]>();
  const classes = useStyles();
  // Initialization for messages
  useEffect(getMessage, []);

  const handleNotificationToggle = () => setNotificationOpen((prev) => {
    if (prev) {
      if (messages && messages.length > 0) {
        messages.forEach(v => v.unRead = false);
        Axios.patch('/api/messages').then();
      }
    } else getMessage();
    return !prev;
  });

  function getMessage() {
    Axios.get<UserModel>('/api/messages').then(res => setMessages(observable(res.data.messages ?? [])));
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
