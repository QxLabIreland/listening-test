import React, {useEffect, useState} from "react";
import {Grid} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import SearchInput from "../../shared/components/SearchInput";
import {useRouteMatch} from "react-router";
import AbTestList from "./AbTestList";
import Axios from "axios";
import {AbTestModel} from "../../shared/models/AbTestModel";
import Loading from "../../shared/components/Loading";


export default function AbTestPage() {
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
      <Grid item container xs={12}>
        <Grid item xs={12} md={6}>
          <SearchInput placeholder="Search tests" onChange={handleSearchChange}/>
        </Grid>
        <Grid item xs={12} md={6} style={{display: 'flex', alignItems: 'center'}}>
          <span style={{flexGrow: 1}}/>
          <Button color="primary" variant="contained" component={Link} to={`${path}/0`}>
            Add test
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {filtered && <AbTestList tests={filtered} handleDelete={handleDelete}/>}
        {data ? null : <Loading error={!!error} message={error}/>}
      </Grid>

    </Grid>
  )
}
