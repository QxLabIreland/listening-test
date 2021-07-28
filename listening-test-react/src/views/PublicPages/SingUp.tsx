import React, {useContext} from 'react';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Button, Checkbox, FormHelperText, Link, TextField, Typography} from '@material-ui/core';
import {useFormik} from "formik";
import {email, maxLength, minLength, mustBeTrue, password, pipeValidator, required} from "../../shared/FormikValidator";
import Axios from "axios";
import {GlobalDialog, GlobalSnackbar} from "../../shared/ReactContexts";
import {Md5} from 'ts-md5/dist/md5';
import {useSignInUpStyles} from "../SharedStyles";
import PublicFormLayout from "./PublicFormLayout";
import {CookiesPolicySnackbar} from "./PolicyTerms/CookiesPolicySnackbar";

export default function SignUp() {
  const classes = useSignInUpStyles();
  const history = useHistory();
  const openDialog = useContext(GlobalDialog);
  const openSnackbar = useContext(GlobalSnackbar);
  // Authorization hooks

  // Form initialization
  const formik = useFormik({
    initialValues: {name: '', email: '', password: '', policy: false, privacyStatement: false},
    onSubmit: values => Axios.post('/api/sign-up', {...values, password: Md5.hashStr(values.password)})
      .then(() => {
        openSnackbar('The confirmation link has been sent. If you didn\'t receive anything please check your spam inbox', undefined, 'info');
        // Get state where user has been blocked by authentication
        history.push('/sign-in', {email: values.email});
      }, (reason) => openDialog(reason.response.data, 'Send us an email to add your organisation')),
    validate: pipeValidator({
      name: [required(), maxLength(128)],
      email: [email(), required()],
      password: [required(), minLength(6), password()],
      policy: [mustBeTrue()],
      privacyStatement: [mustBeTrue()],
    })
  });

  return <PublicFormLayout classes={classes}>
    <form className={classes.form} onSubmit={formik.handleSubmit}>
      <Typography className={classes.title} variant="h2">
        Create new account
      </Typography>
      <Typography color="textSecondary" gutterBottom className={classes.suggestion}>
        Use valid email address to create new account.
      </Typography>
      <TextField className={classes.textField} error={!!formik.errors.name} fullWidth autoFocus
                 helperText={formik.errors.name} label="Your Name" name="name"
                 onChange={formik.handleChange} type="text" variant="outlined"/>

      <TextField className={classes.textField} error={!!formik.errors.email} fullWidth
                 helperText={formik.errors.email} label="Email Address" name="email"
                 onChange={formik.handleChange} type="text" variant="outlined"/>

      <TextField className={classes.textField} error={!!formik.errors.password} fullWidth
                 helperText={formik.errors.password} label="Password" name="password" autoComplete="new-password"
                 onChange={formik.handleChange} type="password" variant="outlined"/>
      {/*Terms of services*/}
      <div className={classes.checkboxFormControl}>
        <Checkbox checked={formik.values.policy} className={classes.checkbox} color="primary" name="policy" onChange={formik.handleChange}/>
        <Typography color="textSecondary" variant="body1">
          I have read the{' '}
          <Link color="primary" component={RouterLink} to="/TermsandConditions.html" variant="h6" type="button" target="_blank">
            Terms and Conditions
          </Link>
        </Typography>
      </div>
      {!!formik.errors.policy && <FormHelperText error>{formik.errors.policy}</FormHelperText>}

      {/*Privacy statement*/}
      <div className={classes.checkboxFormControl} style={{margin: 0}}>
        <Checkbox checked={formik.values.privacyStatement} className={classes.checkbox} color="primary" name="privacyStatement" onChange={formik.handleChange}/>
        <Typography color="textSecondary" variant="body1">
          I have read the{' '}
          <Link color="primary" component={RouterLink} to="/GoListenPrivacyStatment.html" variant="h6" type="button" target="_blank">
            Privacy Statement
          </Link>
        </Typography>
      </div>
      {!!formik.errors.privacyStatement && <FormHelperText error>{formik.errors.privacyStatement}</FormHelperText>}

      <Button className={classes.signInUpButton} color="primary" fullWidth
              size="large" type="submit" variant="contained">
        Sign up now
      </Button>
      <Typography color="textSecondary" variant="body1">
        Have an account?{' '}
        <Link component={RouterLink} to="/sign-in" variant="h6" type="button">
          Sign in here
        </Link>
      </Typography>
    </form>
    <CookiesPolicySnackbar/>
  </PublicFormLayout>
};
