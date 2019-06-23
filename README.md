# Swiss-Blockchain-Hackathon-19

## Architecture

### Blockchain Technology Stack

### API Documentation 
We are proposing 4 api using the URL: https://ml0x15kkrc.execute-api.us-east-1.amazonaws.com/Prod/driver

/changeOwnership   POST	To register a new driver into the system

/createdriver   POST	To track who own the package based on the last handover

/getDrivers  GET	To facilitate the search of driver who needs to be approved

/searchPackage  GET	To allow a driver to see the list of packages available for the delivery.

### Datamodel
Our solution proposes to use Ethereum and an Aurora dB.
Here are the 2 mains table that we can present.


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

### AWS Architecture
Most of the workloads for the current system rely on AWS System, especially on the AWS serverless. That provides the high escalability and reliability that such a system demand.

The Application Front-end consumes several API's provided by the AWS API Gateway, whose endpoints are AWS Lambda Functions. The User Regisration and Authorization process is made through an AWS Cognito User Pool together with an AWS Aurora DB for KYC data.

Data for the main entities (Packages and Deliverers) are stored through the system in the Ethereum Blockchain, and also on AWS Dynamo DB and AWS Aurora DB. 

## Further Enhancements

### Additional Value Proposition
The system brings togather traditional carriers and private deliverers, and it can easily be expanded for other value propositions such as:
- Last mile optimizations
- Exact time delivery

### Package Classification using ML model
(Under development) The desing of the system includes a highly performant Packages classification system based on AWS Dynamo DB, AWS Lambda Functions, AWS SNS and AWS SQS, together with some ML models deployed to identify the availabilty and potential for packets to be delivered through any of these alternative systems.
