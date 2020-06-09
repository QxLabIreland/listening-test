import {observer} from "mobx-react";
import {SurveyControlModel, SurveyControlType} from "../../shared/models/SurveyControlModel";
import React, {useState} from "react";
import {Button, CardContent, Grid, ListItemIcon, ListItemText, Menu, MenuItem, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import {observable} from "mobx";

export default observer(function SurveySetUp(props) {
  // Create an array for survey
  const {items} = props;
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
      items.push({type: type, question: 'Untitled question', options: ['Add your options!']});
    else items.push({type: type, question: 'Untitled question'});
    // Close the adding menu
    setAnchorEl(null);
  }

  const handleDelete = (control) => items.splice(items.indexOf(control), 1);

  return <Card>
    <CardHeader title="AB test Survey"/>
    <CardContent>
      <Grid container spacing={3}>
        {items.map((c, i) =>
          <Grid item container spacing={3} key={i}>
            {/*Question input*/}
            <Grid item xs={12} container justify="space-between">
              <Grid item style={{flexGrow: 1, paddingRight: 16}}>
                <TextField fullWidth variant="filled" label="Your question" value={c.question}
                           onChange={(e) => c.question = e.target.value}/>
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
  // If it is not an options control
  if (type !== SurveyControlType.checkbox && type !== SurveyControlType.radio) return null;

  function handleDelete(index: number) {
    control.options.splice(index, 1);
  }

  const handleAdd = (event) => {
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
        <Grid item style={{flexGrow: 1, paddingRight: 16}}>
          <TextField fullWidth variant="standard" value={o} autoFocus
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
