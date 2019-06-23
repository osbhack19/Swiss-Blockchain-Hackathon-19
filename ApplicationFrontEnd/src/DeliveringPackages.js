import React, { useState } from 'react';
import {
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import map from './route.png';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  image: {
    width: '80%',
    textAlign: 'center'
  },
  button: {
    marginTop: theme.spacing(3)
  },
  text: {
    marginTop: theme.spacing(3)
  }
}));

export default function DeliveringPackages() {
  const classes = useStyles();
  const [values, setValues] = useState({
    showDialog: false
  });

  const handleClose = () => {
    setValues({ ...values, showDialog: false });
  };

  const packageDetails = () => (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell variant="head">Package Origin</TableCell>
          <TableCell>
            Post CH AG, Filiale, Gutenbergstrasse 1, 8002 Zürich
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell variant="head">Package Destination</TableCell>
          <TableCell>CV VC AG, Dammstrasse 16, 6300 Zug</TableCell>
        </TableRow>
        <TableRow>
          <TableCell variant="head">Dimensions</TableCell>
          <TableCell>88x34x1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );

  const signForPackage = () => {
    return (
      <Dialog open={values.showDialog} onClose={handleClose} fullScreen>
        <DialogTitle id="max-width-dialog-title">Sign For Package</DialogTitle>
        <DialogContent>
          <DialogContentText>Package details</DialogContentText>
          {packageDetails()}
          <img
            className={classes.image}
            src="https://media.giphy.com/media/tKnLzyLtn8XAnqzOee/giphy.gif"
            alt="sign for package"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Deliver Next Package
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container component="main" maxWidth="lg" className={classes.root}>
      <Typography variant="h3" gutterBottom>
        Let's Deliver Packages!
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <img
            className={classes.image}
            src="https://media.giphy.com/media/12E3pQ4coQ4EOA/giphy.gif"
            // src={map}
            alt="girl on scooter"
          />
          {/* <Button color="primary" variant="outlined">
            Begin Journey
          </Button> */}
        </Grid>
        <Grid item xs={12} sm={6}>
          {packageDetails()}
          <Typography variant="body2" className={classes.text}>
            Earnings for this package: CHF 3.9
          </Typography>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => setValues({ ...values, showDialog: true })}
      >
        I've Arrived!
      </Button>
      {signForPackage()}
    </Container>
  );
}
