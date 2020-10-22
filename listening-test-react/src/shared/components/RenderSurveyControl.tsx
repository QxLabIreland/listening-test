import {SurveyControlModel} from "../models/SurveyControlModel";
import {SurveyControlType} from "../models/EnumsAndTypes";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel, Link,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@material-ui/core";
import React from "react";
import {observer} from "mobx-react";

export const LinkedDescriptionRender = function ({content}: {content: string}) {
  const linkRegex = /\[([^\]]*)]\(([^)]*)\)/g;
  // Get all links in the description
  const links: RegExpExecArray[] = []
  let array1;
  while ((array1 = linkRegex.exec(content)) !== null) links.push(array1);
  // Get text except links
  const nonLinkTexts = content.split(/\[(?:[^\]]*)]\((?:[^)]*)\)/g);
  // Build final style
  return <Typography>{nonLinkTexts.map((value, index) => <React.Fragment key={index}>
    {value}{index < links.length && <Link href={links[index][2]} target="_blank">{links[index][1]}</Link>}
  </React.Fragment>)}</Typography>;
}

export const RenderSurveyControl = observer(function ({control}: { control: SurveyControlModel }) {
  if (control.disabled) return null;

  switch (control.type) {
    case SurveyControlType.text:
      return <TextField fullWidth variant="filled" label={control.question} required={control.required}
                        onChange={event => control.value = event.target.value}/>
    case SurveyControlType.radio:
      return <SurveyRadio control={control}/>
    case SurveyControlType.checkbox:
      return <SurveyCheckbox control={control}/>
    case SurveyControlType.description:
      return <LinkedDescriptionRender content={control.question}/>
    default:
      return null;
  }
})

const SurveyRadio = observer(function (props: { control: SurveyControlModel }) {
  const {control} = props;

  return <FormControl variant="filled" fullWidth required={control.required}>
    <FormLabel component="legend">{control.question}</FormLabel>
    <RadioGroup value={control.value} onChange={(event => control.value = event.target.value)}>
      {control.options && control.options.map(o =>
        <FormControlLabel key={o} value={o} control={<Radio/>} label={o}/>
      )}
    </RadioGroup>
  </FormControl>
})

const SurveyCheckbox = observer(function (props: { control: SurveyControlModel }) {
  const {control} = props;
  const values: string[] = control.value ? control.value.split(',') : [];

  function handleCheckbox(event: any) {
    // To array for manipulation
    if (event.target.checked) values.push(event.target.name)
    else values.splice(values.indexOf(event.target.name), 1);
    // To string for storing value
    control.value = values.toString();
  }

  return <FormControl variant="filled" fullWidth required={control.required}>
    <FormLabel component="legend">{control.question}</FormLabel>
    <FormGroup>
      {control.options && control.options.map(o =>
        <FormControlLabel key={o} label={o} control={
          <Checkbox name={o} onChange={handleCheckbox} checked={values.includes(o)}/>
        }/>
      )}
    </FormGroup>
    <FormHelperText/>
  </FormControl>
})

