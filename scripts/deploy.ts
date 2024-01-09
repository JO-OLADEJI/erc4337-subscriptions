import { ethers } from "hardhat";
import deployConfig from "../deploy-config.json";
import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const deployPayModule = async () => {
  try {
    const PayModule = await ethers.deployContract("RecurringPaymentsModule");
    await PayModule.waitForDeployment();
    console.log("RecurringPaymentsModule: ", await PayModule.getAddress());
  } catch (error) {
    console.error(error);
  }
};

const deploySubRouter = async () => {
  try {
    const SUBSCRIPTION_PRICE = ethers.parseEther("0.01");
    const SubRouter = await ethers.deployContract("SubscriptionRouter", [
      SUBSCRIPTION_PRICE,
      deployConfig.SUB_ROUTER_DEFAULT_OPERATOR === ""
        ? ethers.ZeroAddress
        : deployConfig.SUB_ROUTER_DEFAULT_OPERATOR,
    ]);
    await SubRouter.waitForDeployment();
    console.log("SubscriptionRouter: ", await SubRouter.getAddress());
  } catch (error) {
    console.error(error);
  }
};

async function main() {
  if (process.env.EOA_SIGNER === undefined) {
    throw new Error("EOA_SIGNER not found in .env");
  }
  await deployPayModule();
  await deploySubRouter();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
