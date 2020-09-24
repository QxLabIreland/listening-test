/** Styles will be used multiple times */

import {CSSProperties} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

export const ratingAreaStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-end'
} as CSSProperties;

export const labelInputStyle = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  outline: 'none',
  border: 'none',
  width: '100%'
} as CSSProperties;

export const useMatStyles = makeStyles((theme: Theme) => {
  const transitionAll = theme.transitions.create('all', {duration: theme.transitions.duration.shortest});
  return createStyles({
    elementGroup: {
      '& > *': {margin: theme.spacing(0.5)}
    },
    animated: {transition: transitionAll},
    flexEnd: {display: 'flex', justifyContent: 'flex-end'}
  });
});

export const useSignInUpStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.background.default,
    minHeight: 'calc(100vh - 64px)',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundImage: 'url(/images/login.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px',
    paddingBottom: 16
  },
  quoteText: {
    color: 'white',
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: 'white'
  },
  bio: {
    color: 'white'
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    // paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 90,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  // Sign In Styles
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  suggestion: {
    marginTop: theme.spacing(2)
  },
  signInUpButton: {
    margin: theme.spacing(2, 0),
    background: 'linear-gradient(45deg, #2991ff 30%, #ff005b 90%)',
  }
}));
