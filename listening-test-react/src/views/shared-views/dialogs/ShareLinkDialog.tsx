import React, {forwardRef, useContext, useImperativeHandle} from "react";
import {IconButtonProps} from "@material-ui/core/IconButton";
import {Button, DialogActions, Link, TextField} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {testItemsValidateIncomplete} from "../../../shared/ErrorValidators";
import {getCurrentHost} from "../../../shared/UncategorizedTools";
import {BasicTaskModel} from "../../../shared/models/BasicTaskModel";
import {GlobalDialog} from "../../../shared/ReactContexts";
import {TestUrl} from "../../../shared/models/EnumsAndTypes";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

export const ShareLinkDialog = forwardRef<HTMLElement & { openShareLinkDialog: () => void },
  IconButtonProps & {
  taskUrl: TestUrl, task: BasicTaskModel,
  shareDialogState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}>(function (props, forwardedRef) {
  const {taskUrl, task, shareDialogState} = props;
  const [open, setOpen] = shareDialogState;
  const openGlobalDialog = useContext(GlobalDialog);

  useImperativeHandle(forwardedRef, () => ({
    openShareLinkDialog: handleClickOpen
  } as any));

  // Create a url for shared link
  if (!task?._id?.$oid) return null;
  const url = getCurrentHost() + `/task/${taskUrl}/${task._id.$oid}`;

  const handleClickOpen = () => {
    // Give a dialog alert that ask if user want to continue. The survey may confuse people.
    const error = testItemsValidateIncomplete(task);
    if (error) openGlobalDialog(error, 'Tips');
    else setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleCopyTaskLink = () => {
    navigator.clipboard.writeText(url).then(handleClose);
    handleClose();
  };
  return <Dialog open={open} onClose={handleClose} fullWidth>
    <DialogTitle>Share and Copy the URL (Link)</DialogTitle>
    <DialogContent>
      <TextField value={url} variant="standard" fullWidth onFocus={event => event.target.select()}/>
      <Link target="_blank" href={url}>View In New Tab</Link>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Cancel</Button>
      <Button onClick={handleCopyTaskLink} color="primary">Copy</Button>
    </DialogActions>
  </Dialog>
});
