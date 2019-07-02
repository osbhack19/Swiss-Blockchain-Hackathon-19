/*global fetch*/
import React, {useContext, useEffect} from 'react';
import { Link, Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from './padely-logo.png';

import {fetchUserProfile} from './modules/UserProfile';

import { GlobalContext} from './store/GlobalContext';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Web3 from 'web3';

const CARRIER_ADDRESS = "0x9180CDfA406f81913943341aF74e0E68EC0fF72b";

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

export default function AddParcel() {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    carrierBalance: 0
  });
  
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  useEffect(() => {
      async function fetchData() {
        const web3 = new Web3('https://rpc.slock.it/goerli');
        
        let balance = await web3.eth.getBalance(CARRIER_ADDRESS);
        setValues({ ...values, carrierBalance: balance/1000000000000000000});
    }
    fetchData();
  }, []);

  const { state, dispatch } = useContext(GlobalContext);

  const submitAddParcel = async e => {

    e.preventDefault();

    try {
      //await signUp(values.emailAddress, values.password);
      // post values object here (using axios)
      
      //let user = await currentAuthenticatedUser();
      //console.log({user});
      console.log(values);
             {/* (uid, fromAddress, toAddress, parcelFormat, price )*/}

      let body =
        {
          "fromAddress": values.fromAddress,
          "toAddress": values.toAddress,
          "parcelFormat": values.parcelFormat,
          "price": values.price
        };
        console.log(body);
        const res = await fetch('https://92tuibx4sl.execute-api.us-west-2.amazonaws.com/Prod/parcel/add', {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
          mode: 'cors',
          method: "POST"
        })
          //axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      console.log(res);
      let responseBody = await res.json();
      console.log(responseBody);
      
      

      setValues({ ...values, uid: responseBody.uid});
      handleClickOpen();
    } catch (e) {
      console.log('Issue adding a parcel', e);
    }
  };

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };


  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Parcel added successfully!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The new parce has the UID: {values.uid}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <div className={classes.paper}>
        <img src={logo} className={classes.logo} alt="OSB logo" />
        <Typography component="h1" variant="h5">
          Add Parcel
        </Typography>
        
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" display="block" gutterBottom>
                  Parcel Details
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fromaddress"
                  name="fromAddress"
                  variant="outlined"
                  required
                  fullWidth
                  id="fromAddress§"
                  label="From Address"
                  autoFocus
                  onChange={handleChange('fromAddress')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="toAddress"
                  label="Destination Address"
                  name="toAddress"
                  autoComplete="toaddress"
                  onChange={handleChange('toAddress')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="parcelFormat"
                  label="Parcel Format"
                  name="parcelFormat"
                  onChange={handleChange('parcelFormat')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Price (in CHF)"
                  name="price"
                  id="price"
                  onChange={handleChange('price')}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submitAddParcel}
            >
              Submit
            </Button>
            <Typography variant="caption" display="block" gutterBottom>
              Carrier Balance: {values.carrierBalance} CHF
            </Typography>
          </form>
        </div>
    </Container>
  );
}
