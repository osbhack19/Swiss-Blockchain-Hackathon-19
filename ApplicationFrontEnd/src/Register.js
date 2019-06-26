/*global fetch*/
import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { signUp, verifyEmailAddress, currentAuthenticatedUser } from './modules/auth';
import logo from './padely-logo.png';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  logo: {
    width: 400
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function SignUp() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    verificationScreen: false,
    verifiedEmailAddress: false
  });

  const attemptSignUp = async e => {
    e.preventDefault();

    try {
      await signUp(values.emailAddress, values.password);
      // post values object here (using axios)
      
      //let user = await currentAuthenticatedUser();
      //console.log({user});
      console.log(values);
      /*dob: "1987-12-12"
emailAddress: "joao.aguiam@gmail.com"
firstName: "asd"
lastName: "asd"
password: "JAguiam.87"
phone: "123123123"
postalId: "asd"
streetAddress: "asd"
streetNumber: "asd"
verificationScreen: false
verifiedEmailAddress: false*/
let body =
  {
    "username": values.emailAddress,
    "DriverAddress": `${values.streetAddress} ${values.streetNumber} ${values.postalId}`,
    "Email": values.emailAddress,
    "Phone": values.phone,
    "DriverLicense": "yes",
    "Birthday": values.dob,
    "Firstname": values.firstName,
    "Surname": values.lastName
  };
  console.log(body);
  const res = await fetch('https://r61qa9p3h5.execute-api.us-west-2.amazonaws.com/Prod/createDriver', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    mode: 'cors',
    method: "POST"
  })
    //axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

      console.log(res);
      


      setValues({ ...values, verificationScreen: true });
    } catch (e) {
      console.log('Issue with sign up', e);
    }
  };

  const attemptVerification = async e => {
    e.preventDefault();

    try {
      await verifyEmailAddress(values.emailAddress, values.verificationCode);

      setValues({ ...values, verifiedEmailAddress: true });
    } catch (e) {
      console.log('Issue with verification', e);
    }
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const renderForm = () => {
    let signUpForm;

    if (values.verificationScreen) {
      signUpForm = (
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="verificationCode"
            onChange={handleChange('verificationCode')}
            label="Verification Code"
            name="verificationCode"
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={attemptVerification}
          >
            Verify
          </Button>
        </form>
      );
    } else {
      signUpForm = (
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" display="block" gutterBottom>
                Personal Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={handleChange('firstName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={handleChange('lastName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Date Of Birth"
                name="dob"
                type="date"
                onChange={handleChange('dob')}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Phone Number"
                name="phone"
                onChange={handleChange('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" display="block" gutterBottom>
                Address Information
              </Typography>
            </Grid>
            <Grid item xs={12} md={7}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Street Address"
                name="street"
                onChange={handleChange('streetAddress')}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Street Number"
                name="street"
                onChange={handleChange('streetNumber')}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Postal ID"
                name="postalId"
                onChange={handleChange('postalId')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" display="block" gutterBottom>
                New Login Credentials
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleChange('emailAddress')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange('password')}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" display="block" gutterBottom>
                KYC Requirements
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <input type="file" required />
              <Typography variant="body2" display="block" gutterBottom>
                Please attach a utility bill that is not more than 2 months old
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <input type="file" required />
              <Typography variant="body2" display="block" gutterBottom>
                Please upload a record of debt collection (Betreibungsauskunft)
                for an even higher credibility
              </Typography>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={attemptSignUp}
          >
            Submit
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      );
    }

    return signUpForm;
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      {values.verifiedEmailAddress ? (
        <Redirect to="/delivery-person-dashboard" />
      ) : null}
      <div className={classes.paper}>
        <img src={logo} className={classes.logo} alt="OSB logo" />
        <Typography component="h1" variant="h5">
          Registration
        </Typography>
        {renderForm()}
      </div>
    </Container>
  );
}
