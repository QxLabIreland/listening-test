import {observer} from "mobx-react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {Box, TextField} from "@material-ui/core";
import {AbExampleModel} from "../../shared/models/AbTestModel";

export const SurveyExampleRadio = observer(function (props: { example: AbExampleModel }) {
  const {example} = props;
  const audios = [example.audioA, example.audioB];

  const handleSelectChange = (event: any, example: any) => {
    example.answer = event.target.value;
  }
  return (
    <Grid item xs={12}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          <Typography>Which is your preference?</Typography>
        </FormLabel>
        <RadioGroup row aria-label="select better one" name="selectAudio" value={example.answer}
                    onChange={(e) => handleSelectChange(e, example)}>
          {audios.map((a, i) =>
            <FormControlLabel key={i} value={a.filename} control={<Radio/>} label={"Audio " + (i + 1)}/>
          )}
          <FormControlLabel value="*" control={<Radio/>} label="They are the same"/>
        </RadioGroup>
      </FormControl>
      <Box mt={2}>
        <TextField variant="outlined" fullWidth label={example.question} value={example.comment}
                   onChange={event => example.comment = event.target.value}/>
      </Box>
    </Grid>
  )
})
