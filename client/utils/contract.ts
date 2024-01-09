import { ethers, Contract, Wallet } from "ethers";
import addresses from "../../data/addresses.json";
import ABIs from "../../data/ABIs.json";

export const getSmaContract = (sma: string, signer: Wallet): Contract => {
  return new ethers.Contract(sma, ABIs["SmartAccount"], signer);
};

export const getSubRouterContract = (signer: Wallet): Contract => {
  return new ethers.Contract(
    addresses.mumbai.SUBSCRIPTION_ROUTER,
    ABIs["SubscriptionRouter"],
    signer
  );
};

export const getPayModuleContract = (signer: Wallet): Contract => {
  return new ethers.Contract(
    addresses.mumbai.RECURRING_PAYMENTS_MODULE,
    ABIs["RecurringPaymentsModule"],
    signer
  );
};
