/*global fetch*/

import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Typography,
  TextField,
  Checkbox,
  Grid,
  Container,
  Button,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import axios from 'axios';
import GoogleMapReact from 'google-map-react';
import { makeStyles } from '@material-ui/core/styles';
import stakeImage from './Stake_Escrow.png';
import { currentAuthenticatedUserEthereumAddress, currentAuthenticatedIsKyc, currentAuthenticatedBalance } from './modules/auth';
import { GlobalContext} from './store/GlobalContext';
import {userStatus} from './store/UserProfileReducer'

const useStyles = makeStyles(theme => ({
  inputField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  image: {
    width: '80%'
  }
}));

export default function DeliveryPersonDashboard() {
  const classes = useStyles();
  const [values, setValues] = useState({
    status: 'kyc-pending',
    currentLocation: 'Trust Square AG, Bahnhofstrasse 3, 8001 Zürich ',
    destination: 'Lüssirainstrasse 4, 6300 Zug',
    showAvailablePackages: false,
    summary: {
      distance: 0,
      time: 0,
      earnings: 0
    },
    rows: []
  });
  const [center, setCenter] = useState({});

    
  const { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      
      
    });

    async function fetchData() {
      const res = await axios(
        'https://r61qa9p3h5.execute-api.us-west-2.amazonaws.com/Prod/searchPackage'
      );
      setValues({ ...values, rows: res.data });
      
      
      setValues({ ...values,  rows: res.data, });
    }
    fetchData();
  }, []);

  const updateSummary = () => {
    const randNum = () => Math.floor(Math.random() * 11) + 1;
    setValues({
      ...values,
      summary: {
        distance: randNum(),
        time: randNum(),
        earnings: randNum() + randNum()
      }
    });
  };

  const driverDashboard = () => {
    let dashboard;

    if (values.confirmedPackages) {
      dashboard = <Redirect to="package-pickup" />;
    } else if (state.userProfile.status === userStatus.KYC_PENDING) {
      dashboard = (
        <Container className={classes.root}>
          <Typography variant="h5" gutterBottom>
            Thank you for registering!
          </Typography>
          <Typography>
            Your KYC approval is currently being processed.
          </Typography>
        </Container>
      );
    } else if (state.userProfile.status === userStatus.STAKE_PENDING) {
      dashboard = (
        <Container className={classes.root}>
          <Typography variant="h5" gutterBottom>
            Congrats! Your details have been verified.
          </Typography>
          <Typography variant="body1" gutterBottom>
            The next step is to stake some ether.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Why is this needed?
          </Typography>
          <Typography variant="body1" gutterBottom>
            As additional security layer, we request each of our ‘padelee‘ to
            deposit Ether worth at least CHF 200 into an escrow account. A
            higher deposit amount also allows padelees to pick-up more parcels
            at once.
          </Typography>
          <Typography variant="h6" gutterBottom>
            What do I need to do?
          </Typography>
          <Typography variant="body1" gutterBottom>
            You have two options:{' '}
            <ol>
              <li>
                Send <b>0.03 ETH</b> to <b> {state.userProfile.ethereumAddress}</b>
              </li>
              <li>Do a bank transfer to the padely bank account (5% fee)</li>
            </ol>
          </Typography>
          <Typography variant="h6" gutterBottom>
            Do I get this money back?
          </Typography>
          <Typography variant="body1" gutterBottom>
            You can retrieve your deposit at any time unless one or more parcels
            are still in your ownership. However, if you have less ‘money’ in
            escrow than the minimum requirement, your profile status will
            automatically change from active to passive and you will no longer
            be able to view nor to select any available packages. If you have a
            great track record and positive customer feedbacks, you will be able
            to withdraw some of your deposit with no impact.
          </Typography>
          <img
            src={stakeImage}
            alt="Stake Escrow image"
            className={classes.image}
          />
        </Container>
      );
    } else if (state.userProfile.status === userStatus.REGISTRATION_COMPLETE) {
      dashboard = (
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" gutterBottom>
              Pickup A Parcel Now!
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
              <Grid container>
                <Grid item xs={12}>
                  <TextField
                    label="Your Location"
                    className={classes.inputField}
                    // onChange={handleChange('location')}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Your Destination"
                    className={classes.inputField}
                    // onChange={handleChange('destination')}
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    className={classes.inputField}
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      setValues({ ...values, showAvailablePackages: true })
                    }
                  >
                    Confirm
                  </Button>
                </Grid>
              </Grid>
            </form>
            {values.showAvailablePackages && (
              <React.Fragment>
                <Divider className={classes.divider} />
                <Typography variant="h6" gutterBottom>
                  Current Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {values.currentLocation}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Destination Address
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {values.destination}
                </Typography>
              </React.Fragment>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <div style={{ height: '55vh', width: '100%' }}>
              {center.lat && center.lng && (
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: 'AIzaSyA2-RA97F67s-VTpmOgHBfV1y0AmqsZ9Kk'
                  }}
                  defaultZoom={11}
                  defaultCenter={{ lat: 47.3675202, lng: 11.5395396 }} // default to Zurich
                  center={center}
                />
              )}
            </div>
          </Grid>
          <Grid item xs={12}>
            {values.showAvailablePackages && (
              <React.Fragment>
                <Divider className={classes.divider} />
                <Typography variant="h5" gutterBottom>
                  Available Packages
                </Typography>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>Pick-up</TableCell>
                        <TableCell>Destination</TableCell>
                        <TableCell>Dimensions</TableCell>
                        <TableCell>Earnings (CHF)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {values.rows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell padding="checkbox">
                            <Checkbox onChange={updateSummary} />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.pickUp}
                          </TableCell>
                          <TableCell>{row.destination}</TableCell>
                          <TableCell>{row.size}</TableCell>
                          <TableCell>{row.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography
                        className={classes.inputField}
                        variant="subtitle2"
                        gutterBottom
                      >
                        Total detour: {values.summary.distance}km (
                        {values.summary.time}mins)
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {/*
                      <Typography
                        className={classes.inputField}
                        variant="subtitle2"
                        gutterBottom
                      >
                        Total earnings: CHF {values.summary.earnings}
                      </Typography>*/}
                    </Grid>
                  </Grid>
                </Paper>

                <Button
                  className={classes.inputField}
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    console.log("EthereumAddress: "+values.ethereumAddress);
                    
                    fetch(`https://31f8qvry68.execute-api.us-west-2.amazonaws.com/Prod/registerParcel/1/${values.ethereumAddress}`, {
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({}),
                      mode: 'cors',
                      method: "POST"
                    })
                    setValues({ ...values, confirmedPackages: true });

                  }}
                >
                  Confirm Packages For Pickup
                </Button>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      );
    }

    return dashboard;
  };

  return driverDashboard();
}
