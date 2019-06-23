const BN = require('bn.js')
const pify = require('pify');

const ethAsync = pify(web3.eth);

var ParcelsNetwork = artifacts.require("ParcelsNetwork");

const assertRevert = async (promise) => {
    try {
        await promise;
    } catch (error) {
        const revertFound = error.message.search('revert') >= 0;
        assert(revertFound, `Expected "revert", got ${error} instead`);
        return;
    }
    assert.fail('Expected revert not received');
}

contract("ParcelsNetwork", async function (accounts) {
    let owner = accounts[0];
    let driver1 = accounts[1];
    let driver2 = accounts[2];
    let carrier1 = accounts[3];
    let carrier2 = accounts[4];
    let kycValidator1 = accounts[5];
    let kycValidator2 = accounts[6];
    let parcelId1 = "56a3bc0f-2b1b-4f11-8f99-1bd73f6932da";
    let parcelId2 = "47e10c5a-6590-4d45-8d12-ea484e99d5bf";
    let parcelId3 = "578ca849-d82d-44eb-b4ce-ccf53ff6c19a";
    let parcelValue = 10000000000000000;

    
    beforeEach(async function () {
        this.contract = await ParcelsNetwork.new({from: owner});
        await this.contract.addKYCValidator(kycValidator1);
        await this.contract.addKYCValidator(kycValidator2);
        await this.contract.addAuthorizedCarrier(carrier1);
        await this.contract.addAuthorizedCarrier(carrier2);
    });


    describe('ParcelsNetwork - KYC', () => {

        it("success set a driver as KYC", async function () {
          await this.contract.setDriverKYC(driver1, {from: kycValidator1});
        });
        
        it("fails setting KYC from non-authorized KYC validator", async function () {
            await assertRevert(this.contract.setDriverKYC(driver1, {from: driver1}));
        });

        it("fails setting KYC twice on the same driver", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            await assertRevert(this.contract.setDriverKYC(driver1, {from: kycValidator2}));
        });

        it("success removing KYC validator", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            await this.contract.removeKYCValidator(kycValidator1, {from: owner});
            await assertRevert(this.contract.setDriverKYC(driver2, {from: kycValidator1}));
        });

        it("success returns a driver is KYC", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            assert(await this.contract.isDriverKYC(driver1), `Driver should be set as KYC`);
        });

        it("success returns a driver is not KYC", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            assert(!(await this.contract.isDriverKYC(driver2)), `Driver should not be set as KYC`);
        });
    });
    describe('ParcelsNetwork - Parcels', () => {

        it("success registering a parcel", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            let balanceBeforeRegisteringParcel = Number(await ethAsync.getBalance(this.contract.address));
            await this.contract.registerParcel(parcelId1, driver1, {from:carrier1, value: parcelValue});
            let balanceAfterRegisteringParcel = Number(await ethAsync.getBalance(this.contract.address));
            let expectedBalance = balanceBeforeRegisteringParcel + parcelValue;

            assert(balanceAfterRegisteringParcel === expectedBalance, "Amount of the contract has not increased correctly");
            let parcelStored = await this.contract.parcels(parcelId1);
            assert(parcelStored.driverAddress === driver1, "Driver stored for the parcel is not the correct one");
            assert(Number(parcelStored.value) === parcelValue, "Parcel value is not the correct one");
            assert(Number(parcelStored.deliverStarted) > 0, "Parcel Start time value is not the correct one");
            assert(Number(parcelStored.deliverFinished) === 0, "Parcel Delivered time value is not zero");
            assert(parcelStored.isDelivered === false, "Parcel isDelivered is not false");
        });    

        it("fails registering a parcel when driver is not KYC", async function () {
            await assertRevert(this.contract.registerParcel(parcelId1, driver1, {from:carrier1, value: parcelValue}));
        });

        it("fails registering a parcel when carrier is not approved", async function () {
            await assertRevert(this.contract.registerParcel(parcelId1, driver1, {from:driver1, value: parcelValue}));
        });

        it("success removing Carrier", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            await this.contract.registerParcel(parcelId1, driver1, {from:carrier1, value: parcelValue});
            await this.contract.removeAuthorizedCarrier(carrier1, {from: owner});
            await assertRevert(this.contract.registerParcel(parcelId1, driver1, {from:carrier1, value: parcelValue}));
        });


        it("success receiving a parcel", async function () {
            await this.contract.setDriverKYC(driver1, {from: kycValidator1});
            await this.contract.registerParcel(parcelId1, driver1, {from:carrier1, value: parcelValue});

            let contractBalanceBefore = Number(await ethAsync.getBalance(this.contract.address));
            let driverBalanceBefore = Number(await ethAsync.getBalance(driver1));
            
            await this.contract.receiveParcel(parcelId1, {from:driver1});
            
            let contractBalanceAfter = Number(await ethAsync.getBalance(this.contract.address));
            let driverBalanceAfter = Number(await ethAsync.getBalance(driver1));
            let expectedBalanceContract = contractBalanceBefore - parcelValue;
            
            assert(contractBalanceAfter === expectedBalanceContract, "Amount of the contract balance has not decreased correctly");
            assert(driverBalanceAfter > driverBalanceBefore, "Amount of the driver balance has not increased");
        
            let parcelStored = await this.contract.parcels(parcelId1);
            assert(parcelStored.driverAddress === driver1, "Driver stored for the parcel is not the correct one");
            assert(Number(parcelStored.value) === parcelValue, "Parcel value is not the correct one");
            assert(Number(parcelStored.deliverStarted) > 0, "Parcel Start time value is not the correct one");
            assert(Number(parcelStored.deliverFinished) > 0, "Parcel Delivered time value is not bigger than zero");
            assert(parcelStored.isDelivered === true, "Parcel isDelivered is not false");
        });    
        

        it("fails registering a parcel if not staked", async function () {
            let notStakedDriver = "0xa265c90b5a2757ae15a07008f69b168a70691c42";
            await this.contract.setDriverKYC(notStakedDriver, {from: kycValidator1});
            await assertRevert(this.contract.registerParcel(parcelId1, notStakedDriver, {from:carrier1, value: parcelValue}));
        });   
    });
});

