import { avalanche, xChain, pChain, cChain } from "../constants/networkSpect";

async function getValidators() {
  var validators = await pChain.getCurrentValidators();
  console.log("validators are");
  console.log(JSON.stringify(validators));
  console.log("eof");
}

export default {
  getValidators,
};