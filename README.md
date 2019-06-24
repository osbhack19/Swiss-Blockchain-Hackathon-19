# padely - deliver parcels and get paid

For the Swiss Blockchain Hackathon, our team decided to tackle the challenges inside the vertical Intelligence Parcels, more specifically, improve the delivery of parcels on the last mile and avoid unnecessary back- and forth-movements of parcels.

To address these issues, we implemented a solution purely based on AWS serverless services and Ethereum blockchain network. We built a solution where private delivery people can take the responsibility of short distance deliveries and avoid unnecessary trajects for parcels that can be delivered next door.

In order to test our platform you can:
- Register [here](https://db84ae4645c84691bad45118fa79e7b1.vfs.cloud9.us-east-1.amazonaws.com:8080/register)
- Validate KYC for new registered participants [here](https://db84ae4645c84691bad45118fa79e7b1.vfs.cloud9.us-east-1.amazonaws.com:8080/kyc-admin)
- Login and Deliver parcels [here](https://db84ae4645c84691bad45118fa79e7b1.vfs.cloud9.us-east-1.amazonaws.com:8080/login)
- Check our Smart Contract [here](https://goerli.etherscan.io/address/0x18b6cdb14a2ceedc26379be78b8116a5523c3075)
- Video of our demo [here](https://sbhack-video-submission.s3.eu-central-1.amazonaws.com/team23/sbhack-team23.mp4)

## Problem statement

### Unmet customer needs
- Flexibility of carriers to deliver at specific times and to specific places
- ASAP delivery of goods
- Parcel tracking and real-time status updates
- Re-route parcels when temporarily or at short-notice not at home
- Receive packages outside of standard business hours
- Reduce number of cars / trucks in cities
- Eco-friendly delivery

### Issues of carriers / Post
- High costs and legal requirement to deliver to all locations within Switzerland
- Increasing parcel volumes: current infrastructure can only handle demands until 2020
- Additional resources (up to 30%) are required during peak-times
- All parcels move through the packaging and delivery centres across the country even if it needs to be delivered back to the same city
- Each and every parcel is forced through the same process disregarding customer needs

## Value Proposition
padely - parcel delivery is an innovative approach to revolutionize the industry
- We deliver packages  within 30 km on the same day at no additional costs through our network of registered padelees
- Increasing customer satisfaction is our priority (speed, usability, flexibility)
- Traditional carriers save ~37% of costs and profits will increase by 10%
- We earn your TRUST by applying state-of-the art technologies and smart functionalities


### Market size

An extensive analysis of the market size for this business can be found in the folder BusinessModel.
 
## Details of our Demo of the product
 
### Driver registration

In order to participate in the network, the driver needs to be registered. This will generate a notification for the KYC validators that will approve the driver.
 
### KYC Driver validation

During the KYC validation process, the validators will approve or deny the new participant in this network. If approved, a new address is created for this participant and the smart contract is updated with the information that the new participant is allowed to distribute packages.

### Staking process for Drivers
 
After being approved, the driver needs to stake a given quantity of money. We plan to use DAI as a stable coin for the staking mechanism. The Driver needs to send this quantity to the address generated only for him, and as long as this account has the minimum staking amount, the user can distribute packages.

 
### Packages Pick-Up

Once a package is picked-up, the post office will send a transaction to the smart contract with the amount to be paid to the driver is sent. This money is stored in the smart contract and paid to the user once the package is delivered. 

### Packages Delivery to the final destination
 
At this stage, a confirmation that the package is received is registered in the smart contract. The driver will also be paid the correspondent amount. 

We envision to create a vesting period of some days in where the money will be kept in smart contract where the recipient can dispute this delivery.

### Payment and Cash-Out

The cash-out is done directly from the created account of the driver to his own account. 

## Architecture

### Blockchain Technology Stack

### API Documentation 
We are proposing 4 api using the URL: https://ml0x15kkrc.execute-api.us-east-1.amazonaws.com/Prod/driver

`/changeOwnership   POST` To register a new driver into the system

`/createdriver   POST` To track who own the package based on the last handover

`/getDrivers  GET` To facilitate the search of driver who needs to be approved

`/searchPackage  GET`To allow a driver to see the list of packages available for the delivery.

### Datamodel
Our solution proposes to use Ethereum and an Aurora dB.
Here are the 2 mains table that we can present.

```
TABLE `DriverTable` (
  `username` varchar(255) DEFAULT NULL,		
  `DriverAddress` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `DriverLicense` varchar(255) DEFAULT NULL,
  `Capacity` mediumtext,
  `Private_key` varchar(255) DEFAULT NULL,
  `Staking_amount` varchar(255) DEFAULT NULL,
  `Rating` float DEFAULT NULL,
  `EthereumAddress` varchar(255) DEFAULT NULL,
  `Birthday` timestamp NULL DEFAULT NULL,
  `IS_KYC` tinyint(1) DEFAULT NULL,
  `Firstname` varchar(255) DEFAULT NULL,
  `Surname` varchar(255) DEFAULT NULL)
```

```
TABLE `PackageTable` (
  `id` mediumtext,
  `PackageId` mediumtext,
  `PackageFormat` varchar(255) DEFAULT NULL,
  `PickupWindowsStart` time DEFAULT NULL,
  `PickupWindowsEnd` time DEFAULT NULL,
  `PickupDate` date DEFAULT NULL,
  `WarehouseAddress` varchar(255) DEFAULT NULL,
  `DeliveryAddress` varchar(255) DEFAULT NULL,
  `PackageStatus` varchar(255) DEFAULT NULL,
  `Rewards` mediumtext,
  `ConfirmationDate` timestamp NULL DEFAULT NULL,
  `EthereumAddress` varchar(255) DEFAULT NULL,
  `PackagePosition` varchar(255) DEFAULT NULL,
  `PackageLevel` varchar(255) DEFAULT NULL)
```

### AWS Architecture
Most of the workloads for the current system rely on AWS System, especially on the AWS serverless. That provides the high scalability and reliability that such a system demand.

The Application Front-end consumes several API's provided by the AWS API Gateway, whose endpoints are AWS Lambda Functions. The User Registration and Authorization process is made through an AWS Cognito User Pool together with an AWS Aurora DB for KYC data.

Data for the main entities (Packages and Deliverers) are stored through the system in the Ethereum Blockchain, and also on AWS Dynamo DB and AWS Aurora DB. 

## Further Enhancements

### Additional Value Proposition
The system brings togather traditional carriers and private deliverers, and it can easily be expanded for other value propositions such as:
- Last mile optimizations
- Exact time delivery

### Package Classification using ML model
(Under development) The design of the system includes a highly performant Packages classification system based on AWS Dynamo DB, AWS Lambda Functions, AWS SNS and AWS SQS, together with some ML models deployed to identify the availability and potential for packets to be delivered through any of these alternative systems.
