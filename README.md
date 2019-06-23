# Swiss-Blockchain-Hackathon-19

## Architecture

### Blockchain Technology Stack

### Datamodel

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
