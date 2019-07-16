
import axios from 'axios';
import {userProfileActions} from '../store/UserProfileReducer';
import Web3 from 'web3';

const mapProfileFromBackEnd = (backEndProfile) => ({
  email: backEndProfile.Email,
  isKyc: backEndProfile.IS_KYC,
  firstName: backEndProfile.Firstname,
  lastName: backEndProfile.Surname,
  ethereumAddress: backEndProfile.EthereumAddress,
  username: backEndProfile.Email,
})

export const fetchUserBalance = (ethereumAddress, dispatch) => {
  async function fetchData() {
    const web3 = new Web3('https://rpc.slock.it/goerli');
    if(ethereumAddress) {
      let balance = await web3.eth.getBalance(ethereumAddress);
      dispatch({type: userProfileActions.BALANCE_UPDATED, balance})
    }
  }
  fetchData();
}

export const fetchUserProfile = (username, dispatch) => {
  async function fetchData() {
    const drivers = await axios('https://r61qa9p3h5.execute-api.us-west-2.amazonaws.com/Prod/getDrivers');
    let userProfile = {};
    
    for(let i = 0; i <drivers.data.length; i++ ) {
      let entry = drivers.data[i];
      if(entry.username === username) {
        userProfile = mapProfileFromBackEnd(entry);
        break;
      }
    }
    dispatch({type: userProfileActions.FETCHED, userProfile})
    fetchUserBalance(userProfile.ethereumAddress, dispatch);
  }
  fetchData();
}

