import {observer} from "mobx-react";
import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel, FormGroup,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField
} from "@material-ui/core";
import {SurveyControlModel, SurveyControlType} from "../../shared/models/SurveyControlModel";

export default observer(function SurveySetUp(props) {
  const {controls, editable} = props as { controls: SurveyControlModel[], editable: boolean };

  function handleCheckbox (event, control) {
    // To array for manipulation
    const values: string[] = control.value.split(',')
    if (event.target.checked) values.push(event.target.name)
    else values.splice(values.indexOf(event.target.name), 1);
    // To string for storing value
    control.value = values.toString();
  }

  return <React.Fragment>
    {controls.map(c => {
      switch (c.type) {
        case SurveyControlType.text:
          return <TextField fullWidth variant="standard" label={c.question}/>

        case SurveyControlType.checkbox:
          return <FormControl component="fieldset">
            <FormLabel component="legend">{c.question}</FormLabel>
            <FormGroup>
              {c.options.map(o => <FormControlLabel label={o} control={
                <Checkbox name={o} onChange={(e) => handleCheckbox(e, c)}/>
              }/>)}
            </FormGroup>
            <FormHelperText>Be careful</FormHelperText>
          </FormControl>

        case SurveyControlType.radio:
          return <FormControl component="fieldset">
            <FormLabel component="legend">{c.question}</FormLabel>
            <RadioGroup aria-label={c.question} value={c.value}>
              <FormControlLabel value="female" control={<Radio/>} label="Female"/>
            </RadioGroup>
          </FormControl>
      }
      return null;
    })}
  </React.Fragment>
})

