pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ParcelsNetwork is Ownable, Pausable{

    uint constant DEFAULT_RATING = 5;
    struct  Driver {
        bool isKYC;
        uint stakedAmount;
        uint rating;
    }

    struct Parcel {
        string parcelId;
        bool isDelivered;
        address payable driverAddress;
        uint deliverStarted;
        uint deliverFinished;
        uint value;
    }

    event KYCRegistered(address driverAddress);
    event KYCRevoked(address driverAddress);

    event DriverStaked(address driverAddress, uint stakedAmount);

    event ParcelRegistered(string parcelId, address driverAddress, uint value);

    event ParcelReceived(string parcelId, address driverAddress, uint payedAmount);

    // Debug events
    event debugBytes32(bytes32 _msg);
    event debugBytes(bytes _msg);
    event debugString(string _msg);
    event debugAddress(address _address);

    // mapping with the addresses authorized to validate a KYC
    mapping (address => bool) public authorizedKYCValidatorsAddresses;

    // mapping with the addresses authorized to distribute parcels
    mapping (address => bool) public authorizedCarrierAddresses;

    // mapping of all drivers by address
    mapping (address => Driver) public drivers;

    // mapping of all tracked parcels, identified by ParcelId
    mapping (string => Parcel) public parcels;

    /*
    ETH price the driver needs to stake in order to be able to start being a distributer agent.
    Currently we consider a fixed price for sake of simplicity, but this needs to be better managed
    in the future and have it related to the amount/value of parcels being able to distribute.
    One can also envision a staking system linked to rating of the driver and require less amount staked 
    if an high rating is observed. This will be evaluated after the hackathon and discussed with the
    carrier partner.
    For the moment we consider the value of ~200 CHF. For a question of simplicity, we are staking ETH, but
    this needs to be changed to a stable coin like DAI in order to remove the volatility of the market from
    the equation. This also needs to be evaluated depending on the network the system will be deployed. 
    Probably, a side chain like xDAI is the best option due to the extreme low fees and fastness.
    */
    uint amountToStake = 730000000000000000;  // ~200CHF in ETH (wei)

    constructor() public {
    }

    // ---------- Carriers ------------

    modifier isAuthorizedCarrier() {
        require(authorizedCarrierAddresses[msg.sender] == true, "Not an authorized Carrier");
        _;
    }
    
    // add a kyc validator to the contract
    function addAuthorizedCarrier(address carrier) public onlyOwner {
        authorizedCarrierAddresses[carrier] = true;
    }

    // remove a kyc validator from the contract
    function removeAuthorizedCarrier(address carrier) public onlyOwner {
        authorizedCarrierAddresses[carrier] = false;
    }

    // ---------- KYC ------------

    modifier isAuthorizedKYCValidator() {
        require(authorizedKYCValidatorsAddresses[msg.sender] == true, "Not an authorized KYC validator");
        _;
    }
    
    modifier isKYCDriver(address driver) {
        require(drivers[driver].isKYC == true, "Driver is not KYC");
        _;
    }

    modifier notKYCDriver(address driver) {
        require(drivers[driver].isKYC == false, "Driver is already KYC");
        _;
    }

    // add a kyc validator to the contract
    function addKYCValidator(address kycValidator) public onlyOwner {
        authorizedKYCValidatorsAddresses[kycValidator] = true;
    }

    // remove a kyc validator from the contract
    function removeKYCValidator(address kycValidator) public onlyOwner {
        authorizedKYCValidatorsAddresses[kycValidator] = false;
    }

    /*
    Set a driver as KYC. This is a off-chain process that only some validators can perform.
    Once the driver is KYC, he can then stake in order to start distributing parcels
    */
    function setDriverKYC(address driver) public isAuthorizedKYCValidator notKYCDriver(driver) whenNotPaused {
        drivers[driver] = Driver(true, 0, DEFAULT_RATING);
        emit KYCRegistered(driver);
    }

    /*
    Returns if a driver is KYC or not
    */
    function isDriverKYC(address driver) public view returns (bool){
        return drivers[driver].isKYC;
    }

    // ---------- Staking ------------

    modifier hasDriverStaked(address driverAddress) {
        require(address(driverAddress).balance >= amountToStake, "Not enough balance staked");
        _;
    }

    // ---------- Parcels ------------

    /* 
    Function triggered when the carrier gives the parcel to a private driver. This will register
    the parcel and associates it with the driver
    */
    function registerParcel(string memory parcelId, address payable driverAddress) public payable isAuthorizedCarrier isKYCDriver(driverAddress) hasDriverStaked(driverAddress) whenNotPaused{
        parcels[parcelId] = Parcel(parcelId, false, driverAddress, block.timestamp, 0, msg.value);
        emit ParcelRegistered(parcelId, driverAddress, msg.value);
    }

    /*
    Function called when the driver delivers the parcel to the destination. He will be payed by the function at this moment.
    Some improvements are needed to only pay after a cetain vesting period, in order to allow disputes to happen and 
    eventually use the staked amount from the driver to compensate the receiver or the carrier
    */
    function receiveParcel(string memory parcelId) public whenNotPaused  {
        require(parcels[parcelId].driverAddress == msg.sender, "Caller is not the driver for this parcel");
        parcels[parcelId].isDelivered = true;
        parcels[parcelId].deliverFinished = block.timestamp;

        uint value = parcels[parcelId].value;
        address payable driverAddress = parcels[parcelId].driverAddress;

        emit ParcelReceived(parcelId, driverAddress, value);
        driverAddress.transfer(value);
    }
}