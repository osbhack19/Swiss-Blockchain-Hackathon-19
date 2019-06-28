import React,  { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  Container
} from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Login from './Login';
import Register from './Register';
import DeliveryPersonDashboard from './DeliveryPersonDashboard';
import PackagePickup from './PackagePickup';
import KycAdmin from './KycAdmin';
import DeliveringPackages from './DeliveringPackages';
import ForgotPassword from './ForgotPassword';
import Home from './Home';
import logo from './logo.png';
import { currentAuthenticatedBalance, currentAuthenticatedUserEthereumAddress } from './modules/auth';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

export default function App() {
  const classes = useStyles();
  const [values, setValues] = useState({
    balance: null
  });
  
  
  useEffect(() => {
    async function fetchData() {
      //let balance = (await currentAuthenticatedBalance())/1000000000000000000;
      //let ethereumAddress = await currentAuthenticatedUserEthereumAddress();
      //setValues({ ...values, balance, ethereumAddress });
    }
    fetchData();
  });
    
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static" color="default">
        <Toolbar>
          <img src={logo} style={{ width: '32px', marginRight: '12px' }} />
          <Typography variant="h6" color="inherit" className={classes.title}>
            padely
          </Typography>
          {/*values.balance !== null && (
            <Typography variant="body1">{values.ethereumAddress} ({values.balance}) ETH</Typography>
          )*/}
          {/* <Typography variant="body1">Andrew Golightly (CHF 33.83)</Typography> */}
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Route path="/" exact component={Home} />
        <Route path="/login" exact component={Login} />
        <Route path="/register/" component={Register} />
        <Route path="/package-pickup/" component={PackagePickup} />
        <Route path="/kyc-admin/" component={KycAdmin} />
        <Route path="/delivering-packages/" component={DeliveringPackages} />
        <Route
          path="/delivery-person-dashboard/"
          component={DeliveryPersonDashboard}
        />
        <Route path="/forgot-password/" component={ForgotPassword} />
      </Container>
    </Router>
  );
}
