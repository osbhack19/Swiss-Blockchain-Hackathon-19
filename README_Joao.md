# padely - deliver parcels and get paid

For the Swiss Blockchain Hackathon, our team decided to tackle the challenges inside the vertical Intelligence Parcels, more specifically, improve the delivery of parcels on the last mile and avoid unnecessary back- and forth-movements of parcels.

To address these issues, we implemented a solution purely based on AWS serverless services and Ethereum blockchain network. We built a solution where private delivery people can take the responsibility of short distance deliveries and avoid unnecessary trajects for parcels that can be delivered next door.

In order to test our platform you can:
- Register [here](https://db84ae4645c84691bad45118fa79e7b1.vfs.cloud9.us-east-1.amazonaws.com:8080/register)
- Validate KYC for new registered participants [here](https://db84ae4645c84691bad45118fa79e7b1.vfs.cloud9.us-east-1.amazonaws.com:8080/kyc-admin)
- Login and Deliver parcels [here](https://db84ae4645c84691bad45118fa79e7b1.vfs.cloud9.us-east-1.amazonaws.com:8080/login)
- Check our Smart Contract [here](https://goerli.etherscan.io/address/0x18b6cdb14a2ceedc26379be78b8116a5523c3075)
- Video of our demo [here]()

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

Once a package is picked-up, the post office will send a transaction to the smart contract with the amount to be paid to the driver is sent. This money is stored in the smartcontract and paid to the user once the package is delivered. 

### Packages Delivery to the final destination
 
At this stage, a confirmation that the package is received is registered in the smart contract. The driver will also be paid the correspondent amount. 

We envision to create a vesting period of some days in where the money will be kept in smart contract where the recipient can dispute this delivery.

### Payment and Cash-Out

The cash-out is done directly from the created account of the driver to his own account. 

## Architecture
 
### Blockchain Technology Stack
 
### Datamodel
 
### AWS Architecture
 
## Further Enhancements
 
### Additional Value Proposition
 
### Package Classification using ML model