import {observer} from "mobx-react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from "@material-ui/core/Typography";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Grid from "@material-ui/core/Grid";
import React from "react";

export default observer(function (props: any) {
  const {example} = props;
  function handleSelectChange(event: any, example: any) {
    example.answer = event.target.value;
  }
  return (
    <Grid item xs={12}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          <Typography>Which one sounds better?</Typography>
        </FormLabel>
        <RadioGroup row aria-label="select better one" name="selectAudio" value={example.answer}
                    onChange={(e) => handleSelectChange(e, example)}>
          {example.audios.map((v: any, i: any) =>
            <FormControlLabel key={v.filename} value={v.filename} control={<Radio/>}
                              label={'Audio' + (i + 1)}/>
          )}
          <FormControlLabel value="*" control={<Radio/>} label="They are the same"/>
        </RadioGroup>
      </FormControl>
    </Grid>
  )
})
