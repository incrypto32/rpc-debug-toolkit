import { ethers } from "ethers";
import { Network, getProvider } from "./ethersHelper";

export function getContractForNetwork(
  address: string,
  network: Network,
  abi?: any
): ethers.Contract {
  abi = abi || require(`../abi.json`);
  console.log("Loading contract for network: " + network);
  console.log("ABI: " + abi);
  const provider = getProvider(network);
  return new ethers.Contract(address, abi, provider);
}

export function getEventsFromContract(
  contract: ethers.Contract,
  eventName: string,
  fromBlock: number,
  toBlock: number
) {
  return contract.queryFilter(
    contract.filters[eventName](),
    fromBlock,
    toBlock
  );
}
