/*global fetch*/
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  DialogContent,
  Button,
  Dialog,
  Link,
  DialogTitle,
  DialogActions,
  DialogContentText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  table: {
    marginBottom: theme.spacing(3)
  }
}));

export default function DeliveryPersonDashboard() {
  const classes = useStyles();
  const [values, setValues] = useState({
    showDialog: false,
    rows: [
     /* {
        name: 'John Williams',
        city: 'Zurich',
        status: ''
      },

      {
        name: 'Samantha Candliss',
        city: 'Geneva',
        status: 'approved'
      }*/
    ]
  });

  useEffect(() => {
    async function fetchData() {
      const res = await axios('https://ml0x15kkrc.execute-api.us-east-1.amazonaws.com/Prod/driver/getDrivers');

      let rows = [];
      for(let i = 0; i <res.data.length; i++ ) {
        let entry = res.data[i];
        rows.push({
          name: entry.Firstname+" "+entry.Surname,
          city: '', 
          status: entry.IS_KYC===1 ? "approved" : "",
          data: entry
        })
      }
      
      setValues({ ...values, rows });
    }
    fetchData();
  }, []);

  const handleClose = () => {
    setValues({ ...values, showDialog: false });
  };




  const personDetails =  () => {
    let row = values.rows[values.selectedItem];
    if(!row)
      return null;
    console.log(row);
    let username = row.data.Email;
    const handleApprove = async () => {
      console.log("approve "+username);
      setValues({ ...values, showDialog: false });
      
      // 
      const res = await fetch(`https://e83xdtqace.execute-api.us-east-1.amazonaws.com/Prod/kyc/${username}/approve`, {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        mode: 'cors',
        method: "POST"
      })
    }
    
    const handleDeny = () => {
      console.log("deny "+username);
      setValues({ ...values, showDialog: false });
    }
    return (
      <Dialog fullWidth open={values.showDialog} onClose={handleClose}>
        <DialogTitle id="max-width-dialog-title">Details</DialogTitle>
        <DialogContent>
          <Table className={classes.table}>
            <TableBody>
              <TableRow>
                <TableCell variant="head">Name</TableCell>
                <TableCell>{row.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Phone</TableCell>
                <TableCell>{row.data.Phone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Date Of Birth</TableCell>
                <TableCell>{row.data.Birthday}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Address</TableCell>
                <TableCell>{row.data.DriverAddress}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Email</TableCell>
                <TableCell>{row.data.Email}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <DialogContentText>Attachments</DialogContentText>
          <DialogContentText>
            <Link href="#">Utility Bill</Link>
          </DialogContentText>
          <DialogContentText>
            <Link href="#">Debt Collection Record</Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Deny
          </Button>
          <Button onClick={handleApprove} color="primary">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h5" gutterBottom>
        List Of All Delivery People
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {values.rows.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => {console.log("on item: "+i); setValues({ ...values, showDialog: true, selectedItem: i })}}
              >
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      {personDetails()}
    </Container>
  );
}
