import React, {useContext, useEffect, useState} from "react";
import Axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Typography
} from "@material-ui/core";
import {useSimpleAlert} from "../../components/utils/UseSimpleAlert";
import Loading from "../../layouts/components/Loading";
import {GlobalDialog} from "../../shared/ReactContexts";
import {fmtFileSize} from "../../shared/UncategorizedTools";
import {StorageStatusModel} from "../../shared/models/StorageStatusModel";

export default function() {
  const [storageStatus, setStorageStatus] = useState<StorageStatusModel>();
  const [alert, setAlert, alertMessage] = useSimpleAlert();
  const [processing, setProcessing] = useState<boolean>();
  const openDialog = useContext(GlobalDialog);
  useEffect(() => {
    Axios.get<StorageStatusModel>('/api/storage').then(res => setStorageStatus(res.data), res => setAlert('error', res.response.data));
  }, []);

  // Give a alert when deleting redundant
  const handleDeleteRedundant = () => openDialog('This action will delete all redundant files permanently and deleted files are not recoverable',
    'Are your sure?', undefined, () => {
    setProcessing(true);
    Axios.delete<StorageStatusModel>('/api/storage').then(res => {
      setStorageStatus(res.data);
      setAlert('success', 'Delete redundant files successfully');
    }, res => setAlert('error', res.response.data)).finally(() => setProcessing(false));
  });

  // If data is undefined, show loading
  if (!storageStatus) return <Loading error={alertMessage?.content}/>;

  return <Grid container spacing={2}>
    <Grid item>
      <Card>
        <CardHeader title="Golisten Storage Status"/>
        <CardContent>
          <Typography>Total size of all files uploaded: <span style={{marginLeft: 16}}>{fmtFileSize(storageStatus.totalSize)}</span></Typography>

          <Typography>Number of files uploaded: <span style={{marginLeft: 16}}>{storageStatus.totalNum}</span></Typography>

          <Typography>Total size of redundant files (that no survey or test is using): <span style={{marginLeft: 16}}>{fmtFileSize(storageStatus.redundantSize)}</span></Typography>
          <br/>
          <Typography variant="body2" color="textSecondary">Normally, the app doesn't delete audio files when users delete their tests,
            because it may take lots of time to query links and delete audio files. Test surveys follow the same rule.
            Additionally, redundant audio files are working like cache. If they don't take too much space we recommend to keep them</Typography>
          {alert}
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button onClick={handleDeleteRedundant} color="secondary" disabled={processing}>
            {processing ? <CircularProgress size={24}/> : 'Delete redundant files'}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  </Grid>
}
