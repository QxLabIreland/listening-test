import React from "react";
import {observer} from "mobx-react";
import {AudioFileModel} from "../../../shared/models/AudioTestModel";
import {Box, Slider} from "@material-ui/core";


export const MusharaRatingBar = observer(function (props: { audio: AudioFileModel }) {
  const marks = [
    {value: 0, label: '0'},
    {value: 20, label: '20'},
    {value: 40, label: '40'},
    {value: 60, label: '60'},
    {value: 80, label: '80'},
    {value: 100, label: '100'},
  ];

  // Set a default value
  const num = parseInt(props.audio.value);
  if (!num) props.audio.value = '0';

  return <Box ml={2.5} mb={2} mt={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={0} max={100} step={1} marks={marks}
            valueLabelDisplay="auto" value={Number(props.audio.value)}
            onChange={(_, value) => props.audio.value = value.toString()}/>
  </Box>
})

