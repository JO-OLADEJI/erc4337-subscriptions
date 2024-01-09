import * as fs from "fs";

const logFilePath = "./sub-hash.txt";

export const logSubHash = (data: string): boolean => {
  console.log({ subHash: data });
  try {
    fs.writeFileSync(logFilePath, data, "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing subscripton-hash to log file:", error);
    return false;
  }
};

export const getSubHash = (): string | null => {
  try {
    const data = fs.readFileSync(logFilePath, "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading subscripton-hash from log file:", error);
    return null;
  }
};

export const logTxReceipt = (txHash: string): void => {
  console.log(`Tx details: https://mumbai.polygonscan.com/tx/${txHash}`);
};
