import React, {useState} from "react";
import {Box, Grid, TextField, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {SurveyControlModel} from "../models/SurveyControlModel";
import {SurveyControlType} from "../ReactEnumsAndTypes";
import {observer} from "mobx-react";

export const SurveyControl = observer(function (props: {
  control: SurveyControlModel,
  label?: string,
  onDelete?: (control) => void
}) {
  const {control, onDelete} = props;
  const {label = control.type === SurveyControlType.description ? 'Your description' : 'Your question'} = props;

  // Render second field for the control
  const switchControlType = () => {
    switch (control.type) {
      case SurveyControlType.text:
        return <TextField fullWidth variant="outlined" label={control.question}
                          value="Subject will answer the question here..." disabled/>
      case SurveyControlType.radio:
      case SurveyControlType.checkbox:
        return <SurveyOptions options={control.options} type={control.type}/>
      case SurveyControlType.description:
        return <Typography>{control.question}</Typography>
      default:
        return null;
    }
  }

  return <>
    {/*Question input*/}
    <Box mb={2} style={{display: 'flex', justifyContent: 'space-between'}}>
      <TextField fullWidth variant="filled" style={{flexGrow: 1}} label={label} value={control.question}
                 onChange={e => control.question = e.target.value}
                 onFocus={event => event.target.select()}/>
      {onDelete && <span style={{paddingLeft: 16}}>
        <IconButton size="small" onClick={() => onDelete(control)}><Icon>delete</Icon></IconButton>
      </span>}
    </Box>
    {switchControlType()}
  </>
});

const SurveyOptions = observer(function (props: { options: string[], type: SurveyControlType }) {
  const {options, type} = props;
  const [autoFocus, setAutoFocus] = useState(false);

  function handleDelete(index: number) {
    options.splice(index, 1);
  }

  const handleAdd = (event) => {
    setAutoFocus(true);
    event.preventDefault();
    event.stopPropagation();
    options.push('Option ' + (options.length + 1));
  }

  const handleChange = (newValue, i) => {
    options[i] = newValue;
  }

  // radio_button_unchecked
  return <Grid container spacing={2}>
    {options?.map((o, i) =>
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
});
