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

export default function PackagePickup() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Typography variant="h3" gutterBottom>
          Packages Pickup
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for delivering packages!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please proceed to
        </Typography>
        <Typography variant="h5" gutterBottom>
          Zurich, Kreis 1
        </Typography>
        <Typography variant="body1" gutterBottom>
          to pickup
        </Typography>
        <Typography variant="h5" gutterBottom>
          5 parcels
        </Typography>
        <Typography variant="body1" gutterBottom>
          On arrival please present this QR code
        </Typography>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
          alt="QR code"
        />
        <Link to="/delivering-packages" variant="body2">
          Packages Collected? Begin deliveries.
        </Link>
      </div>
    </Container>
  );
}
