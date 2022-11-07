import { axia } from "../constants/networkSpect";
import { myWallet, syncWallet } from "./basic"
import { Utils } from "@axia-systems/wallet-sdk"
import { filterValidators } from "../utils/helpers";

async function getValidators() {
  var validators = await axia.CoreChain().getCurrentValidators()
  var filtered = filterValidators(validators)
  const data = JSON.stringify(filtered)
  console.log(data)
  return filtered
}

async function addValidator(nodeID: string, amount: string, start: number, end: number, fee: number, rewardAddress?: string) {
  try {
    const amtCore = Utils.numberToBNAxcCore(amount)
    await syncWallet(myWallet)
    const txid = await myWallet.validate(nodeID, amtCore, new Date(start), new Date(end), fee, rewardAddress)
    return { "txID": txid }
  } catch (err) {
    (<any>window).send("log", { error: err.message });
    return err.message;
  }
}

async function nominateNode(nodeID: string, amount: string, start: number, end: number, rewardAddress?: string) {
  try {
    const amtCore = Utils.numberToBNAxcCore(amount)
    await syncWallet(myWallet)
    const txid = await myWallet.nominate(nodeID, amtCore, new Date(start), new Date(end), rewardAddress)
    return { "txID": txid }
  } catch (err) {
    (<any>window).send("log", { error: err.message });
    return err.message;
  }
}

export default {
  getValidators,
  addValidator,
  nominateNode
};