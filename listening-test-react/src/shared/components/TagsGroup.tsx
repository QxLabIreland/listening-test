import React, {useState} from "react";
import {Box, Chip} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  chipGroup: {
    '& > *': {margin: theme.spacing(0.5)}
  }
}));

export default function TagsGroup (props: {tags: string, onChange: (value) => void}) {
  const classes = useStyles();
  const [newLabel, setNewLabel] = useState('Add Tag');
  const {tags, onChange} = props;

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setNewLabel('');
      // Add a new tag into the file model
      if (!tags) {
        onChange(newLabel);
        return;
      }
      // Check duplicate
      if (tags.includes(newLabel)) return;
      // Push and refresh component
      const tagsArr = tags.split(',');
      tagsArr.push(newLabel);
      onChange(tagsArr.toString());
    }
  }

  const handleLabelDelete = (index) => {
    const tagsArr = tags.split(',');
    tagsArr.splice(index, 1);
    onChange(tagsArr.toString());
  }

  return <Box className={classes.chipGroup}>
    {tags && tags.split(',').map((l, i) =>
      <Chip size="small" label={l} onDelete={() => handleLabelDelete(i)} key={l}/>)}

    <Chip size="small" variant="outlined" icon={<Icon>add</Icon>}
          label={<input onKeyUp={handleEnter} value={newLabel} onChange={(e => setNewLabel(e.target.value))}
                        onFocus={event => event.target.select()} onBlur={() => setNewLabel('Add Tag')}
                        style={{border: 'none', outline: 'none', width: 53, background: 'transparent'}}/>}
    />
  </Box>
}
