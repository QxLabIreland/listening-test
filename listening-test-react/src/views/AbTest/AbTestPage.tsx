import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import SearchInput from "../../shared/components/SearchInput";
import {useRouteMatch} from "react-router";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AudioAbList from "./AudioAbList";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../shared/components/Loading";

const useStyles = makeStyles((theme: Theme) => createStyles({
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  }
}));

export default function AbTestPage() {
  const classes = useStyles();
  const {path} = useRouteMatch();
  const [data, setData] = useState<AbTestModel[]>(null);
  const [filtered, setFiltered] = useState<AbTestModel[]>(null);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    Axios.get<AbTestModel[]>('/api/ab-test', {withCredentials: true})
      .then((res) => {
        setData(res.data);
        setFiltered(res.data);
      }, reason => setError(reason));
  }, [])

  const handleSearchChange = (event) =>
    setFiltered(data.filter(value =>
      // Name searching
      value.name.toLowerCase().includes(event.target.value.toLowerCase())
      // Date searching
      || value.createdAt.$date.toString().toLowerCase().includes(event.target.value.toLowerCase())
    ));

  const handleDelete = (obj: AbTestModel) =>
    Axios.delete('/api/ab-test', {params: {_id: obj._id.$oid}}).then(() =>
      setData(data.splice(data.indexOf(obj), 1))
    );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.row}>
        <span className={classes.spacer}/>
        <Button color="primary" variant="contained" component={Link} to={`${path}/0`}>
          Add test
        </Button>
      </Grid>
      <Grid item xs={12} className={classes.row}>
        <SearchInput placeholder="Search tests" onChange={handleSearchChange}/>
      </Grid>
      <Grid item xs={12}>
        {filtered && <AudioAbList tests={filtered} handleDelete={handleDelete}/>}
        {data ? null : <Loading error={!!error} message={error}/>}
      </Grid>

    </Grid>
  )
}
