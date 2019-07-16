export const userProfileActions = {
  FETCHED: 'USER_PROFILE.FETCHED',
  BALANCE_UPDATED: 'USER_PROFILE.BALANCE_UPDATED'
}


export const userStatus = {
  KYC_PENDING: 'kyc-pending',
  STAKE_PENDING: 'stake-pending',
  REGISTRATION_COMPLETE: 'registration-complete'
}

export const initialUserProfileState = {
    email: null,
    isKyc: false,
    firstName: null,
    lastName: null,
    ethereumAddress: null,
    username: null,
    balance: 0,
    isFetched: false,
    status: userStatus.KYC_PENDING
    
};

const STAKE_AMOUNT = 30000000000000000; // 0.03ETH

const computeUserStatus = (userProfile) => {
  let status = userStatus.KYC_PENDING;
  if(userProfile.isKyc) {
    status = userStatus.STAKE_PENDING;
    if(userProfile.balance >=  STAKE_AMOUNT) {
      status = userStatus.REGISTRATION_COMPLETE;
    }
  }
  return {...userProfile, status }
}

export const userProfileReducer = (state, action) => {
  switch (action.type) {
    case userProfileActions.FETCHED:
      console.log({state, action});
      return computeUserStatus({...state, ...action.userProfile, isFetched: true});
    case userProfileActions.BALANCE_UPDATED:
      console.log({state, action});
      return computeUserStatus({...state, balance: action.balance});
    default:
      return state;
  }
};