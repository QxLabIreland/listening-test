import {SurveyControlModel} from "../models/SurveyControlModel";
import {SurveyControlType} from "../models/EnumsAndTypes";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@material-ui/core";
import React from "react";
import {observer} from "mobx-react";
import ReactMarkdown from 'react-markdown';


export const SurveyControlRender = observer(function ({control}: { control: SurveyControlModel }) {
  if (!control || control.disabled) return null;

  switch (control.type) {
    case SurveyControlType.text:
      return <TextField fullWidth variant="filled" label={control.question} required={control.required}
                        onChange={event => control.value = event.target.value}/>
    case SurveyControlType.radio:
      return <SurveyRadio control={control}/>
    case SurveyControlType.checkbox:
      return <SurveyCheckbox control={control}/>
    case SurveyControlType.description:
      return <div><ReactMarkdown linkTarget="_blank">{control.question}</ReactMarkdown></div>
    default:
      return null;
  }
})

const SurveyRadio = observer(function (props: { control: SurveyControlModel }) {
  const {control} = props;

  return <FormControl variant="filled" fullWidth>
    <ReactMarkdown linkTarget="_blank">{control.question}</ReactMarkdown>
    <RadioGroup value={control.value} onChange={(event => control.value = event.target.value)}>
      {control.options?.map(o =>
        <FormControlLabel key={o} value={o} control={<Radio/>} label={o}/>
      )}
    </RadioGroup>
    {control.required && <Typography variant="caption" color="textSecondary">This question is required *</Typography>}
  </FormControl>
})

const SurveyCheckbox = observer(function (props: { control: SurveyControlModel }) {
  const {control} = props;
  // Make sure it is compatible with old version of commas value
  let values: string[];
  try {
    values = control.value ? JSON.parse(control.value): [];
  }
  catch (err) {
    values = control.value ? control.value.split(',') : [];
  }

  function handleCheckbox(event: any) {
    // To array for manipulation
    if (event.target.checked) values.push(event.target.name)
    else values.splice(values.indexOf(event.target.name), 1);
    // To string for storing value
    control.value = JSON.stringify(values);
  }

  return <FormControl variant="filled" fullWidth>
    <ReactMarkdown linkTarget="_blank">{control.question}</ReactMarkdown>
    <FormGroup>
      {control.options?.map(o =>
        <FormControlLabel key={o} label={o} control={
          <Checkbox name={o} onChange={handleCheckbox} checked={values.includes(o)}/>
        }/>
      )}
    </FormGroup>
    {control.required && <Typography variant="caption" color="textSecondary">This question is required *</Typography>}
  </FormControl>
})

