import {observer} from "mobx-react";
import {SurveyControlModel, SurveyControlType} from "../../shared/models/SurveyControlModel";
import React, {useState} from "react";
import {
  Button,
  CardContent,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {useScrollToView} from "../../shared/ReactHooks";

export const SurveySetUpView = observer(function (props) {
  // Create an array for survey
  const {items} = props;
  const {viewRef, scrollToView} = useScrollToView();
  // const [items] = useState(observable([
  //   {type: 0, question: 'Text test'},
  //   {type: 1, question: 'Radio test', options: ['1', '2', '3']},
  //   {type: 2, question: 'Checkbox test', options: ['a', 'b', 'c']},
  // ] as SurveyControlModel[]));

  // When menu clicked
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleAddMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdd = (type: SurveyControlType) => {
    // Check controls types
    if (type === SurveyControlType.radio || type === SurveyControlType.checkbox)
      items.push({type: type, question: 'Untitled question ' + (items.length + 1), options: ['Add your options!'], value: null});
    else items.push({type: type, question: 'Untitled question ' + (items.length + 1)});
    // Close the adding menu
    setAnchorEl(null);
    scrollToView();
  }

  const handleDelete = (control) => items.splice(items.indexOf(control), 1);

  return <Card>
    <CardHeader title="Create a survey before the test"/>
    <CardContent>
      <Grid container spacing={3}>
        {items.map((c, i) =>
          <Grid item container spacing={3} key={i} ref={viewRef} style={{scrollMarginTop: 100}}>
            {/*Question input*/}
            <Grid item xs={12} container justify="space-between">
              <Grid item style={{flexGrow: 1, paddingRight: 16}}>
                <TextField fullWidth variant="filled" label={'Your question ' + (i+1)} value={c.question}
                           onChange={(e) => c.question = e.target.value} onFocus={event => event.target.select()}/>
              </Grid>
              <Grid item>
                <IconButton size="small" onClick={() => handleDelete(c)}><Icon>delete</Icon></IconButton>
              </Grid>
            </Grid>
            {/*Options editor*/}
            <Grid item xs={12}><SurveyOptions control={c} type={c.type}/></Grid>
          </Grid>
        )}
        <Grid item container justify="center" xs={12}>
          <Grid item>
            {/*Adding menu Button*/}
            <Button variant="outlined" color="primary" onClick={handleAddMenuClick}><Icon>add</Icon>Add a question</Button>
            <Menu anchorEl={anchorEl} keepMounted open={!!anchorEl} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>
                <Typography variant="body1"><strong>Answer Input Type</strong></Typography>
              </MenuItem>
              <MenuItem onClick={() => handleAdd(SurveyControlType.text)}>
                <ListItemIcon>
                  <Icon fontSize="small">text_fields</Icon>
                </ListItemIcon>
                <ListItemText primary="Text Input"/>
              </MenuItem>
              <MenuItem onClick={() => handleAdd(SurveyControlType.radio)}>
                <ListItemIcon>
                  <Icon fontSize="small">radio_button_checked</Icon>
                </ListItemIcon>
                <ListItemText primary="Radio Group"/>
              </MenuItem>
              <MenuItem onClick={() => handleAdd(SurveyControlType.checkbox)}>
                <ListItemIcon>
                  <Icon fontSize="small">check_box</Icon>
                </ListItemIcon>
                <ListItemText primary="Checkbox Group"/>
              </MenuItem>
            </Menu>

          </Grid>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
})

const SurveyOptions = observer((props: { control: SurveyControlModel, type: SurveyControlType }) => {
  const {control, type} = props;
  const [autoFocus, setAutoFocus] = useState(false);
  // If it is not an options control
  if (type === SurveyControlType.text) return (
    <TextField fullWidth variant="outlined" label={control.question} value="Subject will answer the question here..."
               disabled/>
  );

  function handleDelete(index: number) {
    control.options.splice(index, 1);
  }

  const handleAdd = (event) => {
    setAutoFocus(true);
    event.preventDefault();
    event.stopPropagation();
    control.options.push('Option ' + (control.options.length + 1));
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
          <TextField fullWidth variant="standard" value={o} autoFocus={autoFocus} onFocus={event=>event.target.select()}
                     onChange={(e) => control.options[i] = e.target.value}/>
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
})
