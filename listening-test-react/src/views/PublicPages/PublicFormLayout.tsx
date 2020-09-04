import {Grid, Typography} from "@material-ui/core";
import React, {PropsWithChildren} from "react";

export default function (props: PropsWithChildren<{ classes: any }>) {
  const {classes, children} = props;

  return <div className={classes.root}>
    <Grid className={classes.grid} container>
      <Grid className={classes.quoteContainer} item lg={5}>
        <div className={classes.quote}>
          <div className={classes.quoteInner}>
            <Typography className={classes.bio} variant="body2">
              Photo by David Kovalenko on Unsplash
            </Typography>
          </div>
        </div>
      </Grid>
      <Grid className={classes.content} item lg={7} xs={12}>
        <div className={classes.content}>
          <div className={classes.contentHeader}/>
          <div className={classes.contentBody}>
            {children}
          </div>
        </div>
      </Grid>
    </Grid>
  </div>
}
