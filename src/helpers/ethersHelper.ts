import { ethers } from "ethers";

export function getProvider(
  network: Network
): ethers.providers.JsonRpcProvider {
  console.log("Loading provider for network: " + network, process.env["RPC_URL_" + network.toUpperCase()]);
  return new ethers.providers.JsonRpcProvider(
    process.env["RPC_URL_" + network.toUpperCase()]
  );
}

export enum Network {
  Mainnet = "mainnet",
  Ropsten = "ropsten",
  Rinkeby = "rinkeby",
  Optimism = "optimism",
  Optimism_Kovan = "optimism_kovan",
}
