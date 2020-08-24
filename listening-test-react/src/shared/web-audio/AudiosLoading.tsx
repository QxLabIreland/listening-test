import React, {RefObject, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {CircularProgress} from "@material-ui/core";

export function useAllAudioReady(refs: RefObject<HTMLAudioElement>[]) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Audio ready promise function for creating callback
    Promise.all(refs.map((el) =>
      new Promise((resolve) => {
        el.current.addEventListener('canplaythrough', resolve);
        el.current.load();
      }) // loadedmetadata, canplay, canplaythrough
    )).then(() => setLoading(false), () => setLoading(false));
  }, []);

  return loading
}

export function AudioLoading(props: {showing: boolean}) {
  if (!props.showing) return null;

  return <Grid container spacing={2} alignItems="center">
    <Grid item><CircularProgress color="secondary"/></Grid>
    <Grid item>Clips are currently loading, just a moment...</Grid>
  </Grid>
}
