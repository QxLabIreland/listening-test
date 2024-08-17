import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { ListSubheader, Menu, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';

import { BasicTaskModel } from '../../shared/models/BasicTaskModel';

/** The menu to add using templates or just a blank page*/
export default function AddTestMenu({ templates }: { templates: BasicTaskModel[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button color="primary" variant="contained" onClick={handleClick}>
        Add test
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose} component={Link} to="0">
          Blank test
        </MenuItem>
        {templates && templates.length ? (
          templates.map(temp => (
            <MenuItem key={temp._id.$oid} component={Link} to="0" state={temp._id.$oid}>
              {temp.name}
            </MenuItem>
          ))
        ) : (
          <ListSubheader>No template</ListSubheader>
        )}
      </Menu>
    </>
  );
}
