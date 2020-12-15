import React, {useContext, useEffect, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Typography
} from "@material-ui/core";
import {useMatStyles} from "./SharedStyles";
import {CurrentUser} from "../shared/ReactContexts";
import Axios from "axios";
import {StorageStatusModel} from "../shared/models/StorageStatusModel";
import Loading from "../layouts/components/Loading";
import {fmtFileSize} from "../shared/UncategorizedTools";
import {useSimpleAlert} from "../shared/components/UseSimpleAlert";

export function StorageAllocation() {
  const classes = useMatStyles();
  const [usage, setUsage] = useState<StorageStatusModel>();
  const {currentUser} = useContext(CurrentUser);
  const [expandStorageAlert, setExpandStorageAlert] = useSimpleAlert();
  useEffect(() => {
    Axios.get<StorageStatusModel>('/api/storage-allocation').then(res => setUsage(res.data));
  }, []);

  currentUser.storageAllocated = currentUser.storageAllocated ?? 524_288_000;

  const handlerExpandStorage = () => setExpandStorageAlert('info', 'Please email golisten@ucd.ie to expand storage');

  return <Grid container spacing={3}>
    <Grid item xs={12}>
      {usage ? <Card>
        <CardHeader title="Storage Usage"/>
        <CardContent>
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" value={usage.totalSize * 100 / currentUser.storageAllocated}/>
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">
                {(usage.totalSize * 100 / currentUser.storageAllocated).toFixed(2)}%
              </Typography>
            </Box>
          </Box>
          <Typography>
            {`Usage of storage: ${fmtFileSize(usage.totalSize)} / ${fmtFileSize(currentUser.storageAllocated)}`}
          </Typography>
          <Typography>
            Number of files uploaded: {usage.totalNum}
          </Typography>
          <br/>
          <Typography variant="body2" color="textSecondary">
            Each account has default 500MB storage. You can delete old or unused tests to free up space.
            Files with the same hash values will be only counted once.
          </Typography>
          {expandStorageAlert}
        </CardContent>
        <CardActions className={classes.flexEnd}>
          <Button color="primary" onClick={handlerExpandStorage}>Expanded storage</Button>
        </CardActions>
      </Card> : <Loading/>}
    </Grid>
  </Grid>
}
