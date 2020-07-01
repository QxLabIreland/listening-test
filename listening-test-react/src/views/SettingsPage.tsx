import React, {useContext} from "react";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, TextField} from "@material-ui/core";
import {useFormik} from "formik";
import Axios from "axios";
import {minLength, pipeValidator, required} from "../shared/FormikValidator";
import {GlobalDialog} from "../shared/ReactContexts";

export default function SettingsPage() {
  const openDialog = useContext(GlobalDialog);

  const formik = useFormik({
    initialValues: {password: '', newPassword: '', confirm: ''},
    onSubmit: values => {
      Axios.put('/api/password', values, {withCredentials: true}).then(() => {
        alert('success');
      }, (reason) => {
        openDialog(reason.response.data);
      });
    },
    validate: pipeValidator({
      password: [required(), minLength(6)],
      newPassword: [required(), minLength(6)],
      confirm: [required(), minLength(6), (value, errors, name) => {
        if (value !== formik.values.newPassword) {
          errors[name] = 'Confirm password is not match with password';
          return true;
        }
        return false;
      }]
    })
  });

  return <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Card>
        <form onSubmit={formik.handleSubmit}>
          <CardHeader title="Update password"/>
          <CardContent>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Current Password" type="password" variant="outlined"
                           {...formik.getFieldProps('password')}
                           error={!!formik.errors.password} helperText={formik.errors.password}/>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="New Password" type="password" variant="outlined"
                           {...formik.getFieldProps('newPassword')}
                           error={!!formik.errors.newPassword} helperText={formik.errors.newPassword}/>
              </Grid>
              <Grid item xs={12}>

                <TextField fullWidth label="Confirm Password" type="password" variant="outlined"
                           {...formik.getFieldProps('confirm')}
                           error={!!formik.errors.confirm} helperText={formik.errors.confirm}/>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions style={{justifyContent: 'flex-end'}}>
            <Button color="primary" type="submit">
              Update
            </Button>
          </CardActions>
        </form>
      </Card>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardHeader title="Update your avatar"/>
        <CardContent>
          More settings will come soon.
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button color="primary">
            Upload
          </Button>
        </CardActions>
      </Card>
    </Grid>
  </Grid>
}
