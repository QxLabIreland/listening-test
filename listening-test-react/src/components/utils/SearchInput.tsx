import clsx from 'clsx';
import React, { ChangeEvent } from 'react';

import { Icon, Input, Paper, Theme } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary
  },
  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  }
}));

export default function SearchInput (props: { placeholder: string, onChange: (_: ChangeEvent<HTMLInputElement>) => void, className?: string}) {
  const {className, onChange, placeholder} = props;
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.root, className)}>
      <Icon>search</Icon>
      <Input placeholder={placeholder}
        className={classes.input}
        disableUnderline
        onChange={onChange}
      />
    </Paper>
  );
};
