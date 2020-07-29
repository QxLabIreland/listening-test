import React, {RefObject, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {CircularProgress} from "@material-ui/core";

export function useAllAudioReady(refs: RefObject<HTMLAudioElement>[]) {
  const [loading, setLoading] = useState(true);
  const audioReady = () => Promise.all(refs.map((el) => {
    return new Promise((resolve) =>
      el.current.addEventListener('canplay', resolve)
    )
  }));

  useEffect(() => {
    audioReady().then(() => setLoading(false), () => setLoading(false));
  }, []);

  return loading
}

export function AudioLoading() {
  return <Grid container spacing={2} alignItems="center">
    <Grid item><CircularProgress color="secondary"/></Grid>
    <Grid item>Clips are currently loading, just a moment...</Grid>
  </Grid>
}
