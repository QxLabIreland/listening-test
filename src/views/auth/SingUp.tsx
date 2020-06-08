import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Button, Checkbox, FormHelperText, Grid, Link, TextField, Typography} from '@material-ui/core';
import {useStyles} from "./SignInUpStyles";
import {useFormik} from "formik";
import {email, maxLength, minLength, mustBeTrue, pipeValidator, required} from "../../shared/FormikValidator";

export default function SignUp() {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {yourName: '', email: '', password: '', policy: false},
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
    validate: pipeValidator({
      yourName: [required(), maxLength(128)],
      email: [email(), required()],
      password: [required(), minLength(6)],
      policy: [mustBeTrue()],
    })
  });

  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        <Grid className={classes.quoteContainer} item lg={5}>
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.bio} variant="body2">
                Photo by David Kovalenko on Unsplash
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentHeader} />
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={formik.handleSubmit}>
                <Typography className={classes.title} variant="h2">
                  Create new account
                </Typography>
                <Typography color="textSecondary" gutterBottom className={classes.suggestion}>
                  Use your email to create new account
                </Typography>
                <TextField className={classes.textField} error={!!formik.errors.yourName} fullWidth
                           helperText={formik.errors.yourName} label="Your Name" name="yourName"
                           onChange={formik.handleChange} type="text" variant="outlined"/>

                <TextField className={classes.textField} error={!!formik.errors.email} fullWidth
                           helperText={formik.errors.email} label="Email address" name="email"
                           onChange={formik.handleChange} type="text" variant="outlined"/>

                <TextField className={classes.textField} error={!!formik.errors.password} fullWidth
                           helperText={formik.errors.password} label="Password" name="password"
                           onChange={formik.handleChange} type="password" variant="outlined"/>
                <div className={classes.policy}>
                  <Checkbox checked={formik.values.policy} className={classes.policyCheckbox}
                            color="primary" name="policy" onChange={formik.handleChange}/>
                  <Typography color="textSecondary" variant="body1">
                    I have read the{' '}
                    <Link color="primary" component={RouterLink} to="/terms-conditions" variant="h6" type="button">
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div>
                {!!formik.errors.policy && <FormHelperText error>{formik.errors.policy}</FormHelperText>}
                <Button className={classes.signUpButton} color="primary" fullWidth
                        size="large" type="submit" variant="contained">
                  Sign up now
                </Button>
                <Typography color="textSecondary" variant="body1">
                  Have an account?{' '}
                  <Link component={RouterLink} to="/sign-in" variant="h6" type="button">
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
