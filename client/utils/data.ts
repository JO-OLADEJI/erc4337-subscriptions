import { ethers, Contract } from "ethers";
import addresses from "../../data/addresses.json";

export const getSubscription = (PayModule: Contract, SubRouter: Contract) => {
  const subPeriod = 30; // SECONDS
  const subscriptionInfo = {
    receiver: addresses.mumbai.SUBSCRIPTION_ROUTER,
    nextPaymentDue: Math.floor(new Date().getTime() / 1000) - subPeriod, // UTC timestamp
    subscriptionPeriod: subPeriod,
    paymentAmount: ethers.utils.parseEther("0.01"),
    callData: SubRouter.interface.encodeFunctionData("extendSubscription"),
  };
  return {
    obj: subscriptionInfo,
    calldata: PayModule.interface.encodeFunctionData("initForSmartAccount", [
      [
        subscriptionInfo.receiver,
        subscriptionInfo.nextPaymentDue,
        subscriptionInfo.subscriptionPeriod,
        subscriptionInfo.paymentAmount,
        subscriptionInfo.callData,
      ],
    ]),
  };
};
