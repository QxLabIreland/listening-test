import React, {useState} from "react";
import {Snackbar} from "@material-ui/core";
import {Link} from "react-router-dom";
import {Alert} from "@material-ui/lab";

export function CookiesPolicySnackbar() {
  const [open, setOpen] = useState(true);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return
    setOpen(false);
  };
  return <Snackbar open={open} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
    <Alert severity="info" onClose={handleClose}>
      This site uses cookies to provide you with a great user experience. By using Golisten, you accept our
      <Link to="/CookiePolicy.html" target="_blank"> use of cookies</Link>.
    </Alert>
  </Snackbar>
}
