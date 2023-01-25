import * as dotenv from "dotenv";
import {
  getContractForNetwork,
  getEventsFromContract,
} from "./helpers/contract";
import { Network } from "./helpers/ethersHelper";
import request, { gql } from "graphql-request";
import { binarySearchForProblemBlock } from "./helpers/subgraphHelpers";
dotenv.config();

const abi = [
  "function getPositionInfo(uint256) view returns (address,address,uint256,uint256)",
  "event PutCollateral(uint256,address,address,uint256,uint256)",
  "event TakeCollateral(uint256,address,address,uint256,uint256)",
];

const contract = getContractForNetwork(
  "0xffa51a5ec855f8e38dd867ba503c454d8bbc5ab9",
  Network.Optimism,
  abi
);

export async function getPositionInfo(
  positionId: number,
  blockNumber?: number
) {
  console.log(
    "Getting data from contract for id: ",
    positionId,
    " blockNumber : ",
    blockNumber
  );
  const positionInfo = await contract.getPositionInfo(positionId, {
    blockTag: blockNumber && blockNumber,
  });

  return positionInfo;
}

async function getDataFromGraph(id: number, blockNumber?: number) {
  const query = blockNumber
    ? gql`
        query MyQuery($id: Int!, $blockNumber: Int!) {
          position(id: $id, block: { number: $blockNumber }) {
            id
            pid
            owner
            collateralSize
            collateralToken {
              id
            }
          }
        }
      `
    : gql`
        query MyQuery($id: Int!) {
          position(id: $id) {
            id
            pid
            owner
            collateralSize
            collateralToken {
              id
            }
          }
        }
      `;

  console.log(
    "Getting data from graph for id: ",
    id,
    "blockNumber: ",
    blockNumber
  );
  const data = await request(
    "https://api.thegraph.com/subgraphs/name/mintcnn/optimism",
    query,
    { id: id, blockNumber: blockNumber }
  );

  return data;
}

async function compareCollateralSize(
  id: number,
  blockNumber?: number
): Promise<boolean> {
  const positionInfo = await getPositionInfo(id, blockNumber);
  const collateralSizeFromContract = positionInfo[3].toString();
  const data = await getDataFromGraph(id, blockNumber);
  const collateralSizeFromGraph = data.position.collateralSize;

  console.log(
    "id: ",
    id,
    "blockNumber: ",
    blockNumber,
    "collateralSizeFromContract: ",
    collateralSizeFromContract,
    "collateralSizeFromGraph: ",
    collateralSizeFromGraph
  );
  return collateralSizeFromContract === collateralSizeFromGraph;
}

async function notMain() {
  // const result = await binarySearchForProblemBlock(
  //   37427557,
  //   70116498,
  //   async (block) => {
  //     return !(await compareCollateralSize(901, block));
  //   }
  // );
  // console.log("RESULT: ", result);
  await compareCollateralSize(901, 66338222);
  console.log("=====================================");
  await compareCollateralSize(901, 66338223);
  console.log("=====================================");
  await compareCollateralSize(901, 66338221);
}

async function main() {
  // const PutCollateralEventFilter = contract.filters.PutCollateral();
  // const putCollateralEventsFromContract = contract.queryFilter(PutCollateralEventFilter, 66338221, 66338224);
  // const TakeCollateralEventFilter = contract.filters.TakeCollateral();
  // const takeCollateralEventsFromContract = contract.queryFilter(TakeCollateralEventFilter, 66338221, 66338224);

  // console.log(await putCollateralEventsFromContract);
  // console.log(await takeCollateralEventsFromContract);

  contract.provider.getBlock(66338221).then((block) => {
    console.log(block);
  }
  );
}

main();
