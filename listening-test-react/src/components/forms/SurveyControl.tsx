import React, {useState} from "react";
import {Box, createStyles, FormControl, Grid, MenuItem, Select, TextField, Theme, Tooltip} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {GotoQuestionItemModel, SurveyControlModel} from "../../shared/models/SurveyControlModel";
import {SurveyControlType} from "../../shared/models/EnumsAndTypes";
import {observer} from "mobx-react";
import {makeStyles} from "@material-ui/core/styles";
import ReactMarkdown from "react-markdown";

export const SurveyControl = observer(function (props: {
  control: SurveyControlModel,
  label?: string,
  gotoQuestionItems?: GotoQuestionItemModel[],
  disableGoto?: boolean
}) {
  const {control, gotoQuestionItems, disableGoto} = props;
  const {label = control.type === SurveyControlType.description ? 'Your description' : 'Your question'} = props;

  const descriptionComponent = <>
    {/*Question input*/}
    <Box mb={2} style={{display: 'flex', justifyContent: 'space-between'}}>
      <TextField fullWidth variant="filled" style={{flexGrow: 1}} multiline label={label} value={control.question}
                 onChange={e => control.question = e.target.value}
                 onFocus={event => event.target.select()}/>
    </Box>
    <ReactMarkdown linkTarget="_blank">{control.question}</ReactMarkdown>
  </>;

  switch (control.type) {
    case SurveyControlType.text:
      return <>
        {/*Question input*/}
        <Box mb={2} style={{display: 'flex', justifyContent: 'space-between'}}>
          <TextField fullWidth variant="filled" style={{flexGrow: 1}} label={label} value={control.question}
                     onChange={e => control.question = e.target.value}
                     onFocus={event => event.target.select()}/>
        </Box>
        <TextField fullWidth variant="outlined" label={control.question} required={control.required}
                   value="Subject will answer the question here..." disabled/>
      </>;
    case SurveyControlType.radio:
    case SurveyControlType.checkbox:
      return <>
        {descriptionComponent}
        <SurveyOptions control={control} gotoQuestionItems={gotoQuestionItems} disableGoto={disableGoto}/>
      </>;
    case SurveyControlType.description:
      return descriptionComponent;
    default:
      return null;
  }
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    gridGrow: {flexGrow: 1},
    selectWidth: {width: theme.spacing(30)}
  }),
);

const SurveyOptions = observer(function ({control, gotoQuestionItems, disableGoto}: {
  control: SurveyControlModel, gotoQuestionItems?: GotoQuestionItemModel[], disableGoto?: boolean
}) {
  const [autoFocus, setAutoFocus] = useState(false);
  const classes = useStyles();

  function handleDelete(index: number) {
    control.options.splice(index, 1);
    // Null checking for mapping
    if (control.gotoQuestionMapping) delete control.gotoQuestionMapping[index];
  }

  const handleAdd = (event: any) => {
    setAutoFocus(true);
    event.preventDefault();
    event.stopPropagation();
    control.options.push('Option ' + (control.options.length + 1));
  }
  const handleChange = (newValue: string, i: number) => {
    control.options[i] = newValue;
  }
  // When blur, fill the empty option
  const handleBlur = (event: any, index: number) => {
    if (!event.target.value) control.options[index] = 'Option ' + (index + 1);
  }
  const handleGotoQuestionChange = (event: any, index: number) => {
    if (!control.gotoQuestionMapping) control.gotoQuestionMapping = {};
    // If got value, we create a mapping.
    if (event.target.value) control.gotoQuestionMapping[index] = event.target.value;
    // Delete mapping and null checking for mapping
    else if (control.gotoQuestionMapping) delete control.gotoQuestionMapping[index];
  }
  const openGlobalSetting = () => {
    if (disableGoto) document.querySelector<HTMLButtonElement>('#testGlobalSettingButton').click();
  }

  // radio_button_unchecked
  return <Grid container spacing={2}>
    {control.options?.map((o, i) =>
      <Grid key={i} item xs={12} container spacing={1} alignItems="flex-end">
        <Grid item>
          <IconButton size="small" disabled>
            {control.type === SurveyControlType.radio && <Icon>radio_button_unchecked</Icon>}
            {control.type === SurveyControlType.checkbox && <Icon>check_box_outline_blank</Icon>}
          </IconButton>
        </Grid>
        {/*Options text field*/}
        <Grid item className={classes.gridGrow}>
          <TextField fullWidth variant="standard" value={o} autoFocus={autoFocus}
                     onFocus={event => event.target.select()} onBlur={event => handleBlur(event, i)}
                     onChange={(e) => handleChange(e.target.value, i)}/>
        </Grid>
        {/*Goto question selection*/}
        {(control.type === SurveyControlType.radio && gotoQuestionItems) && <Grid item>
          <Tooltip
            title={disableGoto ? 'You must enable "Show each question individually" in Global settings. Click to open the settings to check the option' : ''}>
            <FormControl className={classes.selectWidth}>
              <Select inputProps={{name: 'goto'}} displayEmpty disabled={disableGoto} onClick={openGlobalSetting}
                      onChange={event => handleGotoQuestionChange(event, i)}
                      value={control.gotoQuestionMapping ? control.gotoQuestionMapping[i] ? control.gotoQuestionMapping[i] : '' : ''}>
                <MenuItem value={''}>Continue to next question</MenuItem>
                {/*<MenuItem value={gotoQuestionAbortValue}>Abort the test</MenuItem>*/}
                {gotoQuestionItems.map(item => <MenuItem value={item.id} key={item.id}>Go to {item.title}</MenuItem>)}
                <MenuItem value={'-1'}>Abort the test</MenuItem>
              </Select>
            </FormControl>
          </Tooltip>
        </Grid>}
        <Grid item>
          <Tooltip title="Delete this option">
            <IconButton size="small" onClick={() => handleDelete(i)}><Icon>clear</Icon></IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    )}
    <Grid item xs={12} container spacing={1} alignItems="flex-end">
      <Grid item>
        <IconButton size="small" disabled>
          {control.type === SurveyControlType.radio && <Icon>radio_button_unchecked</Icon>}
          {control.type === SurveyControlType.checkbox && <Icon>check_box_outline_blank</Icon>}
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
