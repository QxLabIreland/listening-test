import React, {useState} from "react";
import {Box, Chip} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => createStyles({
  chipGroup: {
    '& > *': {margin: theme.spacing(0.5)}
  }
}));

export default function TagsGroup (props: {tags: string[], onChange: (value) => void}) {
  const classes = useStyles();
  const [newLabel, setNewLabel] = useState('Add Tag');
  let {tags, onChange} = props

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setNewLabel('Add Tag');
      // Add a new label into the file model
      if (!tags) tags = [];
      // Check duplicate
      if (tags.includes(newLabel)) return;
      // Push and refresh component
      tags.push(newLabel);
      onChange(Object.assign([], tags));
    }
  }

  const handleLabelDelete = (index) => {
    tags.splice(index, 1);
    onChange(Object.assign([], tags));
  }

  return <Box className={classes.chipGroup}>
    {tags && tags.map((l, i) =>
      <Chip size="small" label={l} onDelete={() => handleLabelDelete(i)} key={l}/>)}

    <Chip size="small" variant="outlined" icon={<Icon>add</Icon>}
          label={<input onKeyUp={handleEnter} value={newLabel} onChange={(e => setNewLabel(e.target.value))}
                        onFocus={event => event.target.select()}
                        style={{border: 'none', outline: 'none', width: 56, background: 'transparent'}}/>}
    />
  </Box>
}
