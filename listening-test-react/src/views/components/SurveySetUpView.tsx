import {observer} from "mobx-react";
import {SurveyControlModel} from "../../shared/models/SurveyControlModel";
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
import {SurveyControl} from "../../shared/components/SurveyControl";
import {SurveyControlType} from "../../shared/ReactEnums";

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
      <Grid container spacing={2}>
        {items.map((c, i) =>
          <Grid item xs={12} key={i} ref={viewRef} style={{scrollMarginTop: 100}}>
            <SurveyControl control={c} label={'Your question ' + (i+1)} onDelete={handleDelete} onChange={control => items[i] = control}/>
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
