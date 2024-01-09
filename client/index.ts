import { ethers, Wallet } from "ethers";
import {
  initSmartAccount,
  setupPayModuleOnSma,
  extendSubscriptionbyEOA,
  extendSubscriptionByDefaultOperator,
} from "./actions";
import { config as dotenvConfig } from "dotenv";
import { getSubHash } from "./utils";
dotenvConfig();

const main = async (): Promise<void> => {
  try {
    const eoaWallet: Wallet = new ethers.Wallet(
      process.env.EOA_SIGNER || "",
      new ethers.providers.JsonRpcProvider(
        "https://rpc.ankr.com/polygon_mumbai"
      )
    );

    const smartAccountV2 = await initSmartAccount(eoaWallet);
    const isModuleEnabled = await setupPayModuleOnSma(
      smartAccountV2,
      eoaWallet
    );

    if (isModuleEnabled) {
      process.env.ROUTER_DEFAULT_OPERATOR !== undefined
        ? await extendSubscriptionByDefaultOperator(
            smartAccountV2,
            getSubHash() ?? "",
            new ethers.Wallet(
              process.env.ROUTER_DEFAULT_OPERATOR,
              new ethers.providers.JsonRpcProvider(
                "https://rpc.ankr.com/polygon_mumbai"
              )
            )
          )
        : await extendSubscriptionbyEOA(
            smartAccountV2,
            getSubHash() ?? "",
            eoaWallet
          );
    } else {
      console.log("error enabling module on sma!");
    }
  } catch (error) {
    console.error(error);
  }
};
main();
