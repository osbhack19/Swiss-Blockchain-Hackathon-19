import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

export default function ForgotPassword() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Forgot your password huh?
        </Typography>
        <Typography variant="body1">
          Maybe it's the name of your favourite pet?
        </Typography>
        <Link to="/login" variant="body2">
          Go back and login
        </Link>
      </div>
    </Container>
  );
}
