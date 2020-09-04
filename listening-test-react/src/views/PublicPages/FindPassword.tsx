import React from "react";
import PublicFormLayout from "./PublicFormLayout";
import {useSignInUpStyles} from "../SharedStyles";
import {Button, TextField, Typography} from "@material-ui/core";
import Axios from "axios";
import {Md5} from "ts-md5";
import {email, minLength, pipeValidator, required} from "../../shared/FormikValidator";
import {useFormik} from "formik";
import {useLocation} from "react-router";
import {useSimpleAlert} from "../../shared/components/UseSimpleAlert";

export default function () {
  const classes = useSignInUpStyles();
  const location = useLocation();
  const [emailAlert, setEmailAlert, message] = useSimpleAlert(true);
  const findPasswordForm = useFormik({
    initialValues: {email: ''},
    onSubmit: values => Axios.put('/api/find-password', {email: values.email}).then(
      () => setEmailAlert('info', 'A link has been sent to you email address'),
      reason => setEmailAlert('error', reason.response.data)
    ),
    validate: pipeValidator({
      email: [email()]
    })
  })

  return <PublicFormLayout classes={classes}>
    {location.search ? <ResetPassword classes={classes}/> : <form className={classes.form}
                                                                  onSubmit={findPasswordForm.handleSubmit}>
      <Typography className={classes.title} variant="h2">
        Find password
      </Typography>
      <Typography className={classes.suggestion} gutterBottom color="textSecondary" variant="body1">
        Please enter your email
      </Typography>
      <TextField type="text" className={classes.textField} fullWidth label="Email address" variant="outlined"
                 {...findPasswordForm.getFieldProps('email')}
                 error={!!findPasswordForm.errors.email} helperText={findPasswordForm.errors.email}/>
      {emailAlert}
      <Button className={classes.signInUpButton} color="primary" fullWidth size="large" type="submit"
              variant="contained" disabled={!!message}>Submit</Button>
    </form>}
  </PublicFormLayout>
}

function ResetPassword({classes}: {classes: any}) {
  const location = useLocation();
  const [alert, setAlert, message] = useSimpleAlert(true);

  const formik = useFormik({
    initialValues: {password: '', confirmPassword: ''},
    // Hash the password
    onSubmit: values => {
      if (location.search) Axios.post('/api/find-password', {
        confirmationCode: location.search.replace('?', ''), password: Md5.hashStr(values.password)
      }).then((res) => setAlert('success', 'Success, you can login with your new password now'),
        reason => setAlert('error', reason.response.data));
    },
    validate: pipeValidator({
      password: [required(), minLength(6)],
      confirmPassword: [required(), minLength(6), (value, errors, name) => {
        if (value !== formik.values.password) {
          errors[name] = 'Confirm password is not match with password';
          return true;
        }
        return false;
      }]
    })
  });

  return <form className={classes.form} onSubmit={formik.handleSubmit}>
    <Typography className={classes.title} variant="h2">
      Reset password
    </Typography>
    <Typography className={classes.suggestion} gutterBottom color="textSecondary" variant="body1">
      Please set your new password
    </Typography>
    <TextField type="password" className={classes.textField} fullWidth label="Password" variant="outlined"
               {...formik.getFieldProps('password')}
               error={!!formik.errors.password} helperText={formik.errors.password}/>
    <TextField type="password" className={classes.textField} fullWidth label="Confirm Password" variant="outlined"
               {...formik.getFieldProps('confirmPassword')}
               error={!!formik.errors.confirmPassword} helperText={formik.errors.confirmPassword}/>
    {alert}
    <Button className={classes.signInUpButton} color="primary" fullWidth size="large" type="submit"
            variant="contained" disabled={!!message}>Submit</Button>
  </form>
}
