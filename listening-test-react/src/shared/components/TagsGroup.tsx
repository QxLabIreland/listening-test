import React, {useRef, useState} from "react";
import {Box, Chip, createStyles} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import {observer} from "mobx-react";
import {useMatStyles} from "../../views/SharedStyles";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => createStyles({
  chipIcon: {fontSize: '1.1rem', cursor: 'pointer'},
  input: {border: 'none', outline: 'none', width: 53, background: 'transparent'}
}))

export const TagsGroup = observer((props: {value: string, onChange: (value: string) => void}) => {
  const classes = useMatStyles();
  const classes1 = useStyles();
  const [newLabel, setNewLabel] = useState('Add Tag');
  const {value, onChange} = props;
  const inputRef = useRef<HTMLInputElement>();

  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (!newLabel) {
        inputRef.current.blur();
        return;
      }
      // Add a new tag into the file model
      if (!value) {
        onChange(newLabel);
        setNewLabel('');
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
  const handleIconClick = () => {
    inputRef.current.focus();
  }

  return <Box className={classes.elementGroup}>
    {value && value.split(',').map((l, i) =>
      <Chip size="small" label={l} onDelete={() => handleLabelDelete(i)} key={l}/>)}

    <Chip size="small" variant="outlined" icon={<Icon className={classes1.chipIcon} onClick={handleIconClick}>add</Icon>}
          label={<input onKeyUp={handleEnter} value={newLabel} onChange={(e => setNewLabel(e.target.value))}
                        onFocus={() => setNewLabel('')} onBlur={() => setNewLabel('Add Tag')}
                        className={classes1.input} ref={inputRef}/>}
    />
  </Box>
})
