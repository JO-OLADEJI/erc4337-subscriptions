import { ethers, Signer, Wallet } from "ethers";
import {
  initSmartAccount,
  setupPayModuleOnSma,
  // extendSubscriptionByDefaultOperator,
} from "./actions";
import { config as dotenvConfig } from "dotenv";
// import { getSubHash } from "./utils";
dotenvConfig();

const main = async (): Promise<void> => {
  try {
    const eoaWallet: Wallet = new ethers.Wallet(
      process.env.EOA_SIGNER || "",
      new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      )
    );
    // const defaultOperatorWallet: Wallet = new ethers.Wallet(
    //   process.env.ROUTER_DEFAULT_OPERATOR || "",
    //   new ethers.providers.JsonRpcProvider(
    //     "https://rpc.ankr.com/polygon_mumbai"
    //   )
    // );

    const smartAccountV2 = await initSmartAccount(eoaWallet);
    await setupPayModuleOnSma(smartAccountV2, eoaWallet);
    // await extendSubscriptionByDefaultOperator(
    //   smartAccountV2,
    //   getSubHash() ?? "",
    //   defaultOperatorWallet
    // );
  } catch (error) {
    console.error(error);
  }
};
main();
