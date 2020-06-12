import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import SearchInput from "../components/SearchInput";
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
  },
  button: {
    marginRight: theme.spacing(1)
  }
}));

export default function AbTestPage () {
  const classes = useStyles();
  const {path} = useRouteMatch();
  const [filtered, setFiltered] = useState(null);
  const {data, error} = useAjaxGetAll<AbTestModel[]>('/api/user/ab-test');

  useEffect(() => {
    // Change it to test
    setFiltered([
      {
        id: 1,
        ref: 'CDD1049',
        amount: 30.5,
        name: 'Ekaterina Tankova',
        createdAt: 1555016400000,
      },
      {
        id: 2,
        ref: 'CDD1048',
        amount: 25.1,
        name: 'Cao Yu',
        createdAt: 1555016400000,
      },
      {
        id: 3,
        ref: 'CDD1047',
        name: 'Alexa Richardson',
        createdAt: 1554930000000,
      }
    ]);
  }, [data, error])

  const handleSearchChange = (event) =>
    setFiltered(data.filter(value =>
      value.createdAt.toDateString().toLowerCase().includes(event.target.value.toLowerCase())
    ));

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} className={classes.row}>
        <span className={classes.spacer}/>
        <Button color="primary" variant="contained" component={Link} to={`${path}/0`}>
          Add test
        </Button>
      </Grid>
      <Grid item xs={12} className={classes.row}>
        <SearchInput className={classes.button} placeholder="Search tests" onChange={handleSearchChange}/>
      </Grid>
      <Grid item xs={12}>
        {filtered && <AudioAbList tests={filtered}/>}
        {data ? null : <Loading error={!!error} message={error}/>}
      </Grid>

    </Grid>
  )
}

function useAjaxGetAll<T extends any[]>(url: string) {
  const [data, setData] = useState<T>(null);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    Axios.get<T>(url, {withCredentials: true})
      .then((res) => setData(res.data), (reason) => setError(reason));
  }, [url])

  return {data, error}
}
