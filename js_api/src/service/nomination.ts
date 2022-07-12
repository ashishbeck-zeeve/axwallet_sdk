import { axia } from "../constants/networkSpect";
import { myWallet, syncWallet } from "./basic"
import { BN, Utils } from "@axia-systems/wallet-sdk"

async function getValidators() {
  var validators = await axia.CoreChain().getCurrentValidators()
  const data = JSON.stringify(validators)
  console.log(data)
  return validators
}

async function nominateNode(nodeID: string, amount: string, start: number, end: number, rewardAddress?: string) {
  try {
    const amtCore = Utils.numberToBNAxcCore(amount)
    const wallet = myWallet // await generateMnemonicWallet(mnemonic)
    await syncWallet(wallet)
    const txid = await wallet.nominate(nodeID, amtCore, new Date(start), new Date(end), rewardAddress)
    return { "txID": txid }
  } catch (err) {
    (<any>window).send("log", { error: err.message });
    return err.message;
  }
}

export default {
  getValidators,
  nominateNode
};