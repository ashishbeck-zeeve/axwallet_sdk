import { axia, assetChain, coreChain, appChain } from "../constants/networkSpect";

async function getValidators() {
  var validators = await coreChain.getCurrentValidators();
  console.log("validators are");
  console.log(JSON.stringify(validators));
  console.log("eof");
}

export default {
  getValidators,
};