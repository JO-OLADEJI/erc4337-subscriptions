import { UserOpReceipt } from "@biconomy/bundler";
import { UserOperation } from "@biconomy/core-types";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { Wallet } from "ethers";
import {
  getPayModuleContract,
  getSubRouterContract,
  logTxReceipt,
} from "../utils";
import addresses from "../../data/addresses.json";

export const extendSubscriptionbyEOA = async (
  smartAccount: BiconomySmartAccountV2,
  subHash: string,
  eoaWallet: Wallet
): Promise<void> => {
  const mPayModuleContract = getPayModuleContract(eoaWallet);
  const subPaymentTx = await (
    mPayModuleContract.populateTransaction as any
  ).executeRecurringPayment(subHash, await smartAccount.getAccountAddress());

  const userOp: Partial<UserOperation> = await smartAccount.buildUserOp([
    {
      to: addresses.mumbai.RECURRING_PAYMENTS_MODULE,
      data: subPaymentTx.data,
    },
  ]);
  const userOpTx: UserOpReceipt = await (
    await smartAccount.sendUserOp(userOp)
  ).wait();
  logTxReceipt(userOpTx.receipt.transactionHash);
};

export const extendSubscriptionByDefaultOperator = async (
  smartAccount: BiconomySmartAccountV2,
  subHash: string,
  defaultOperatorWallet: Wallet
) => {
  const mSubRouterContract = getSubRouterContract(defaultOperatorWallet);
  const subPaymentTx = await mSubRouterContract.extendSubscriptionByOperator(
    addresses.mumbai.RECURRING_PAYMENTS_MODULE,
    subHash,
    await smartAccount.getAccountAddress()
  );
  await subPaymentTx.wait();
  logTxReceipt(subPaymentTx.hash);
};
