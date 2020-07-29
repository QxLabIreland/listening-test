import React, {useState} from "react";
import {Box, Chip} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {observer} from "mobx-react";
import {useElementGroupStyle} from "../../views/SharedStyles";

export const TagsGroup = observer((props: {value: string, onChange: (value: string) => void}) => {
  const classes = useElementGroupStyle();
  const [newLabel, setNewLabel] = useState('Add Tag');
  const {value, onChange} = props;

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      // Add a new tag into the file model
      if (!value) {
        onChange(newLabel);
        return;
      }
      // Check duplicate
      if (value.split(',').includes(newLabel)) return;
      setNewLabel('');
      // Push and refresh component
      const tagsArr = value.split(',');
      tagsArr.push(newLabel);
      onChange(tagsArr.toString());
    }
  }

  const handleLabelDelete = (index: number) => {
    const tagsArr = value.split(',');
    tagsArr.splice(index, 1);
    onChange(tagsArr.toString());
  }

  return <Box className={classes.elementGroup}>
    {value && value.split(',').map((l, i) =>
      <Chip size="small" label={l} onDelete={() => handleLabelDelete(i)} key={l}/>)}

    <Chip size="small" variant="outlined" icon={<Icon>add</Icon>}
          label={<input onKeyUp={handleEnter} value={newLabel} onChange={(e => setNewLabel(e.target.value))}
                        onFocus={event => event.target.select()} onBlur={() => setNewLabel('Add Tag')}
                        style={{border: 'none', outline: 'none', width: 53, background: 'transparent'}}/>}
    />
  </Box>
})
