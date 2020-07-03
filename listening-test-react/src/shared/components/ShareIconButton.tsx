import {useState} from "react";
import * as React from "react";
import {getCurrentHost} from "../ReactTools";
import {Icon, IconButton, Snackbar} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

export function ShareIconButton(props) {
  const {url, ...rest} = props;
  const [open, setSnackbarOpen] = useState(false);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false);
  };
  const handleShareClick = () => {
    navigator.clipboard.writeText(getCurrentHost() + url)
      .then(() => setSnackbarOpen(true));
  }

  return (
    <React.Fragment>
      <IconButton {...rest} size="small" color="primary"
                  onClick={handleShareClick}><Icon>share</Icon></IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Copy the link to clipboard successfully"
        action={
          <React.Fragment>
            <Button size="small" color="secondary" component={Link}
                    to={url}>View</Button>

            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <Icon fontSize="small">cancel</Icon>
            </IconButton>
          </React.Fragment>
        }
      />
    </React.Fragment>
  )
}
