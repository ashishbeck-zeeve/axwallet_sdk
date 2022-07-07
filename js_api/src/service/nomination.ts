import { coreChain } from "../constants/networkSpect";
import { myWallet, syncWallet } from "./basic"
import { BN } from "@axia-systems/wallet-sdk"

async function getValidators() {
  var validators = await coreChain.getCurrentValidators()
  const data = JSON.stringify(validators)
  console.log(data)
  return validators
}

async function nominateNode(nodeID: string, amount: string, start: number, end: number, rewardAddress?: string) {
  const wallet = myWallet // await generateMnemonicWallet(mnemonic)
  await syncWallet(wallet)
  const txid = await wallet.nominate(nodeID, new BN(amount), new Date(start), new Date(end), rewardAddress)
  return { "txID": txid }
}

export default {
  getValidators,
  nominateNode
};