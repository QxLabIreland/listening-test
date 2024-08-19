import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import React, { ChangeEvent, useEffect } from 'react';

import {
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { TestItemType } from '../../../shared/enums/test-items';
import { BasicTaskItemModel } from '../../../shared/models/BasicTaskModel';
import { testDetails } from '../test-details-store';
import HeaderIconButtons from './components/HeaderIconButtons';
import TitleInput from './components/TitleInput';

/** Section header/Group divider to group questions together */
export default observer(function GroupDivider({ item }: { item: BasicTaskItemModel }) {
  // Create items to use for multi selection
  const items: { title: string; id: string }[] = [];
  (function () {
    const fullItems = testDetails.data.items;
    for (let i = fullItems.findIndex(value => value === item) + 1; i < fullItems.length; i++) {
      if (fullItems[i].type !== TestItemType.sectionHeader)
        items.push({ title: fullItems[i].title, id: fullItems[i].id });
      else break;
    }
  })();
  // Set an object to make sure changes callbacks work
  useEffect(() => {
    if (!item.sectionSettings) runInAction(() => (item.sectionSettings = {}));
  }, []);

  const handleRandomizationChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) =>
    runInAction(() => (item.sectionSettings.randomQuestions = checked));

  const handleSelectedFixChange = (event: any) =>
    // This will clean fixedItems by filtering out those not in items
    runInAction(
      () =>
        (item.sectionSettings.fixedItems = (event.target.value as string[]).filter(
          id => items.findIndex(item => item.id === id) > -1,
        )),
    );

  return (
    <div>
      <Typography variant="h4" sx={{ display: 'flex', marginRight: 8 }}>
        <TitleInput item={item} />
        <Tooltip
          title="This divider will not appear in the test but you can use it to create groups of questions 
which can be randomised within in a group. You need to start and end each group with a group divider">
          <IconButton>
            <Icon>help_outline</Icon>
          </IconButton>
        </Tooltip>
        <HeaderIconButtons item={item} />
      </Typography>
      <Collapse in={!item.collapsed} timeout="auto" unmountOnExit>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={item.sectionSettings?.randomQuestions ?? false} onChange={handleRandomizationChange} />
            }
            label="Randomize question for this section"
          />
        </FormGroup>
        <FormControl sx={{ width: 340 }} disabled={!item.sectionSettings?.randomQuestions}>
          <InputLabel id="demo-mutiple-checkbox-label">Select your fixed items</InputLabel>
          <Select
            labelId="demo-mutiple-checkbox-label"
            id="demo-mutiple-checkbox"
            multiple
            sx={{ width: 340 }}
            value={item.sectionSettings?.fixedItems ?? [{ id: '0', title: 'No items' }]}
            onChange={handleSelectedFixChange}
            input={<Input />}
            renderValue={selected =>
              (selected as string[]).map(id => items.find(value1 => value1.id === id)?.title).join(', ')
            }>
            {items.map(value => (
              // Disable when id is '0' and show no items tip.
              <MenuItem key={value.id} value={value.id} disabled={value.id === '0'}>
                <Checkbox checked={item.sectionSettings?.fixedItems?.indexOf(value.id) > -1} />
                <ListItemText primary={value.title} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Collapse>
    </div>
  );
});
