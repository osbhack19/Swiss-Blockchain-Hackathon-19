import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from './padely-logo.png';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  image: {
    width: '88%',
    textAlign: 'center'
  }
}));

export default function Home() {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="lg">
      <div className={classes.paper}>
        <img src={logo} alt="padely logo" className={classes.image} />
        <Typography variant="h6" gutterBottom>
          You decide when to work!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Working with padely gives you flexibility and independence. By being
          self-employed, you enjoy the advantages of working according to your
          own availability.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Earn great money!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Everyone wants to get their parcels as soon as possible and volume of
          packages is increasing rapidly! This gives you the opportunity to
          deliver lots of parcels and make very good money. On average you’ll
          get about CHF 4 per delivered parcel and can choose from about 50’000
          packages every day!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Things you’ll need!
        </Typography>
        <Typography variant="body1" gutterBottom>
          <ul>
            <li>Be at least 18 years old</li>
            <li>
              A bicycle, car or scooter with the necessary safety equipment to
              deliver parcels
            </li>
            <li>A smartphone</li>
            <li>Proof of your right to work in Switzerland</li>
          </ul>
        </Typography>
        <Typography variant="h6" gutterBottom>
          How does padely work?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Step 1: Download the App from the Apple App Store or Google Play
          <br />
          Step 2: Apply to deliver parcels, get approved and deposit some funds
          <br />
          Step 3: Select parcels that are on your way and pick them up at the
          next post office
        </Typography>

        <Typography variant="body1" gutterBottom>
          <Link to="register">Get started</Link>. It only takes 3 minutes.
        </Typography>
      </div>
    </Container>
  );
}
