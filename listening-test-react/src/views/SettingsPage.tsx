import React, {useContext} from "react";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography} from "@material-ui/core";
import {useFormik} from "formik";
import Axios from "axios";
import {minLength, pipeValidator, required} from "../shared/FormikValidator";
import {GlobalDialog} from "../shared/ReactContexts";
import {Md5} from "ts-md5";
import {useSimpleAlert} from "../shared/components/UseSimpleAlert";
import {useHistory} from "react-router";

export default function SettingsPage() {

  return <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <ChangePassword/>
    </Grid>
    <Grid item xs={12} md={6}>
      <AccountDeletion/>
    </Grid>
    <Grid item xs={12} md={6}>
      <Card>
        <CardHeader title="Other settings"/>
        <CardContent>
          More settings will come soon.
        </CardContent>
        <CardActions style={{justifyContent: 'flex-end'}}>
          {/*<Button color="primary">Upload</Button>*/}
        </CardActions>
      </Card>
    </Grid>
  </Grid>
}

function ChangePassword() {
  const [passwordAlert, setPasswordMessage] = useSimpleAlert();
  const formik = useFormik({
    initialValues: {currentPassword: '', newPassword: '', newPasswordConfirm: ''},
    onSubmit: values => Axios.put('/api/password', {
      // Hash all of things
      password: Md5.hashStr(values.currentPassword),
      newPassword: Md5.hashStr(values.newPassword)
    }).then(() => setPasswordMessage('success', 'You have successfully updated your password'),
      (reason) => setPasswordMessage('error', reason.response.data)),
    // Validation before submitting
    validate: pipeValidator({
      currentPassword: [required(), minLength(6)],
      newPassword: [required(), minLength(6)],
      newPasswordConfirm: [required(), minLength(6), (value, errors, name) => {
        if (value !== formik.values.newPassword) {
          errors[name] = 'New password confirmation is not match with new password';
          return true;
        }
        return false;
      }]
    })
  });

  return <Card><form onSubmit={formik.handleSubmit}>
      <CardHeader title="Update password"/>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">Enter your current and new password to update your password.</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Current Password" type="password" variant="outlined"
                       {...formik.getFieldProps('currentPassword')}
                       error={!!formik.errors.currentPassword} helperText={formik.errors.currentPassword}/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="New Password" type="password" variant="outlined"
                       {...formik.getFieldProps('newPassword')}
                       error={!!formik.errors.newPassword} helperText={formik.errors.newPassword}/>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Confirm Password" type="password" variant="outlined"
                       {...formik.getFieldProps('newPasswordConfirm')}
                       error={!!formik.errors.newPasswordConfirm} helperText={formik.errors.newPasswordConfirm}/>
          </Grid>
        </Grid>
        {passwordAlert}
      </CardContent>
      <CardActions style={{justifyContent: 'flex-end'}}>
        <Button color="primary" type="submit">
          Update
        </Button>
      </CardActions>
    </form></Card>
}

function AccountDeletion() {
  const openDialog = useContext(GlobalDialog);
  const [accountDeletionAlert, setAccountDeletionMessage] = useSimpleAlert();
  const history = useHistory();

  const accountDeletion = useFormik({
    initialValues: {password: ''},
    onSubmit: values => openDialog('Your account and all the data related to it will be deleted permanently. Once you confirmed, the process cannot be stop',
      'Are your sure?', null, () => Axios.delete('/api/password', {
        // Hash all of things
        data: {password: Md5.hashStr(values.password)}
      }).then(() => openDialog('You have successfully delete your account', 'Success', () => history.push('/sign-in')),
        (reason) => setAccountDeletionMessage('error', reason.response.data)
      )
    ),
    validate: pipeValidator({
      password: [required(), minLength(6)]
    })
  });

  return <Card>
    <form onSubmit={accountDeletion.handleSubmit}>
      <CardHeader title="Delete my account"/>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              If you would like delete your account, fill your current password and click DELETE MY ACCOUNT button.
              This action will delete your account and related data permanently and they cannot be recovered.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Current Password" type="password" variant="outlined"
                       {...accountDeletion.getFieldProps('password')}
                       error={!!accountDeletion.errors.password} helperText={accountDeletion.errors.password}/>
          </Grid>
        </Grid>
        {accountDeletionAlert}
      </CardContent>
      <CardActions style={{justifyContent: 'flex-end'}}>
        <Button color="secondary" type="submit">DELETE MY ACCOUNT</Button>
      </CardActions>
    </form>
  </Card>
}
