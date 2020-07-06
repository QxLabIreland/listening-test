import React, {useState} from "react";
import {Box, Grid, TextField} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControlModel} from "../models/SurveyControlModel";
import {SurveyControlType} from "../ReactEnums";

export const SurveyControl = (props: {
  control: SurveyControlModel,
  label: string,
  onDelete?: (control) => void,
  onChange: (control: SurveyControlModel) => void
}) => {
  const {control, label, onDelete, onChange} = props;

  return <>
    {/*Question input*/}
    <Box mb={2} style={{display: 'flex', justifyContent: 'space-between'}}>
      <TextField fullWidth variant="filled" style={{flexGrow: 1}} label={label} value={control.question}
                 onChange={e => onChange({...control, question: e.target.value})}
                 onFocus={event => event.target.select()}/>
      {onDelete && <span style={{paddingLeft: 16}}>
        <IconButton size="small" onClick={() => onDelete(control)}><Icon>delete</Icon></IconButton>
      </span>}
    </Box>
    {/*Options editor*/}
    <SurveyOptions control={control} type={control.type}
                   onChange={options => onChange({...control, options})}/>
  </>
};

const SurveyOptions = (props: { control: SurveyControlModel, type: SurveyControlType, onChange: (options: string[]) => void }) => {
  const {control, type, onChange} = props;
  const [autoFocus, setAutoFocus] = useState(false);
  // If it is not an options control
  if (type === SurveyControlType.text) return (
    <TextField fullWidth variant="outlined" label={control.question} value="Subject will answer the question here..."
               disabled/>
  );

  function handleDelete(index: number) {
    control.options.splice(index, 1);
    // React original state changing
    onChange(control.options);
  }

  const handleAdd = (event) => {
    setAutoFocus(true);
    event.preventDefault();
    event.stopPropagation();
    control.options.push('Option ' + (control.options.length + 1));
    // React original state changing
    onChange(control.options);
  }

  const handleChange = (newValue, i) => {
    control.options[i] = newValue;
    onChange(control.options);
  }

  // radio_button_unchecked
  return <Grid container spacing={2}>
    {control.options && control.options.map((o, i) =>
      <Grid key={i} item xs={12} container spacing={1} alignItems="flex-end">
        <Grid item>
          <IconButton size="small" disabled>
            {type === SurveyControlType.radio && <Icon>radio_button_unchecked</Icon>}
            {type === SurveyControlType.checkbox && <Icon>check_box_outline_blank</Icon>}
          </IconButton>
        </Grid>
        {/*Options text field*/}
        <Grid item style={{flexGrow: 1, paddingRight: 16}}>
          <TextField fullWidth variant="standard" value={o} autoFocus={autoFocus}
                     onFocus={event => event.target.select()}
                     onChange={(e) => handleChange(e.target.value, i)}/>
        </Grid>
        <Grid item>
          <IconButton size="small" onClick={() => handleDelete(i)}><Icon>clear</Icon></IconButton>
        </Grid>
      </Grid>
    )}
    <Grid item xs={12} container spacing={1} alignItems="flex-end">
      <Grid item>
        <IconButton size="small" disabled>
          {type === SurveyControlType.radio && <Icon>radio_button_unchecked</Icon>}
          {type === SurveyControlType.checkbox && <Icon>check_box_outline_blank</Icon>}
        </IconButton>
      </Grid>
      <Grid item>
        <TextField fullWidth variant="standard" placeholder="Add an Option" onFocus={handleAdd}/>
      </Grid>
      <Grid item>
        {/*{!control.otherOption && <Button color="primary">Add the Other Option</Button>}*/}
      </Grid>
    </Grid>
  </Grid>
}

