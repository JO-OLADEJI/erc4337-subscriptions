import { UserOpReceipt } from "@biconomy/bundler";
import { UserOperation } from "@biconomy/core-types";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { ethers, Wallet, BytesLike, BigNumber } from "ethers";
import addresses from "../../data/addresses.json";
import {
  getSmaContract,
  getPayModuleContract,
  getSubRouterContract,
  getSubscription,
  logTxReceipt,
  logSubHash,
} from "../utils";

export const setupPayModuleAndInitSub = async (
  smartAccount: BiconomySmartAccountV2,
  eoaWallet: Wallet
): Promise<boolean> => {
  try {
    const mPayModule = getPayModuleContract(eoaWallet);
    const mSubRouter = getSubRouterContract(eoaWallet);
    const mSmaContract = getSmaContract(
      await smartAccount.getAccountAddress(),
      eoaWallet
    );

    // send some matic to your smart account
    const smaEthBalance: BigNumber = await eoaWallet.provider.getBalance(
      await smartAccount.getAccountAddress()
    );
    const hasSufficientEth = smaEthBalance.gt(
      getSubscription(mPayModule, mSubRouter).obj.paymentAmount
    );
    if (!hasSufficientEth) {
      const tx = await eoaWallet.sendTransaction({
        to: await smartAccount.getAccountAddress(),
        value: ethers.utils.parseEther("0.02").sub(smaEthBalance),
      });
      await tx.wait();
    }

    let isModuleEnabled = false;
    while (!isModuleEnabled) {
      console.log("Installing PayModule . . .");
      const subscriptionInfo = getSubscription(mPayModule, mSubRouter);
      const subHash: BytesLike = await mPayModule.getSubHash(
        subscriptionInfo.obj
      );
      logSubHash(subHash.toString());

      const userOp: Partial<UserOperation> = await smartAccount.buildUserOp([
        {
          to: await smartAccount.getAccountAddress(),
          data: mSmaContract.interface.encodeFunctionData(
            "setupAndEnableModule",
            [
              addresses.mumbai.RECURRING_PAYMENTS_MODULE,
              subscriptionInfo.calldata,
            ]
          ),
        },
      ]);
      const userOpTx: UserOpReceipt = await (
        await smartAccount.sendUserOp(userOp)
      ).wait();
      logTxReceipt(userOpTx.receipt.transactionHash);

      isModuleEnabled = await mSmaContract.isModuleEnabled(
        addresses.mumbai.RECURRING_PAYMENTS_MODULE
      );
    }
    console.log("PayModule enabled ✅");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error building user operation:", error.message);
    }
    return false;
  }
};
