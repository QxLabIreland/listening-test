import React from "react";
import {observer} from "mobx-react";
import {AudioFileModel} from "../../../shared/models/AudioTestModel";
import {Box, Slider} from "@material-ui/core";

export const AcrRatingBar = observer(function ({audio}: { audio: AudioFileModel }) {
  const marks = [
    {value: 1, label: '1 - Bad'},
    {value: 2, label: '2 - Poor'},
    {value: 3, label: '3 - Fair'},
    {value: 4, label: '4 - Good'},
    {value: 5, label: '5 - Excellent'},
  ];

  // Set a default value
  if (!parseInt(audio.value) && audio.value !== '0') audio.value = '3';

  return <Box ml={2.5} mb={2} mt={2} style={{height: 200}}>
    <Slider orientation="vertical" aria-labelledby="vertical-slider" min={1} max={5} step={1} track={false}
            getAriaValueText={(value: number) => `${value}`} marks={marks}
            value={Number(audio.value)}
            onChange={(_, value) => audio.value = value.toString()}/>
  </Box>
})

