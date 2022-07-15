import { axia, changeAxiaProvider } from "../constants/networkSpect";
import { Utils, MnemonicWallet, Network, History, GasHelper, NetworkConstants, BN } from "@axia-systems/wallet-sdk"
import { getNetworkConfig } from "../utils/helpers";
import { NetworkConfig } from "@axia-systems/wallet-sdk/dist/Network";

export let myWallet: MnemonicWallet;

async function generateMnemonicWallet(mnemonic: string) {
  const wallet = MnemonicWallet.fromMnemonic(mnemonic)
  await wallet.resetHdIndices()
  await syncWallet(wallet)
  console.log("Wallet generated")
  return myWallet = wallet
}

export async function syncWallet(wallet: MnemonicWallet) {
  // await Promise.all([
  await wallet.updateUtxosSwap()
  await wallet.updateUtxosCore()
  await wallet.updateAxcBalanceAX()
  // ])
}

// config = {"url": "https://1.p2p-v2.testnet.axiacoin.network:443", "networkID": 5678, "explorerURL": "https://magellan-v2.testnet.axiacoin.network", "explorerSiteURL": "https://axscan-v2.testnet.axiacoin.network"}
async function changeNetwork(config: Object) {
  const network: NetworkConfig = getNetworkConfig(config)
  try {
    await Network.setNetworkAsync(network)
    console.log("Successfully changed to " + network.rawUrl)
    changeAxiaProvider(network)
    // need this so that the wallet in the different network updates all the addresses
    if (myWallet != null) {
      await myWallet.resetHdIndices()
      await syncWallet(myWallet)
    }
    return true
  } catch (e) {
    console.log("Failed to change network")
    console.log(e)
    return false
  }
}

async function getWallet() {
  const wallet: MnemonicWallet = myWallet // await generateMnemonicWallet(mnemonic)
  await syncWallet(wallet)
  const swap = (wallet.getAddressSwap()) //(wallet.getChangeAddressX())
  const core = (wallet.getAddressCore())
  const ax = (wallet.getAddressAX())
  const allSwap = wallet.getAllAddressesSwapSync()
  const allCore = wallet.getAllAddressesCoreSync()
  const data = {
    "swap": swap,
    "core": core,
    "ax": ax,
    "allSwap": allSwap,
    "allCore": allCore,
  }
  // console.log(data)
  return data
}

async function getBalance() {
  const wallet: MnemonicWallet = myWallet // await generateMnemonicWallet(mnemonic)
  await syncWallet(wallet)
  const bal = wallet.getAxcBalance();
  const swapBal = Utils.bnToAxcSwap(bal.Swap.unlocked);
  const coreBal = Utils.bnToAxcCore(bal.Core.unlocked);
  const axBal = Utils.bnToAxcAX(bal.AX);
  // console.log([swapBal, coreBal, axBal])
  const staked = Utils.bnToAxcCore((await wallet.getStake()).staked)
  // console.log(staked)
  return {
    "swap": swapBal,
    "core": coreBal,
    "ax": axBal,
    "staked": staked,
  }
}

async function init(mnemonic?: string, network?: NetworkConfig) {
  // set test net by default
  const connected = myWallet == null ? await changeNetwork(network) : true

  if (connected && mnemonic != null) {
    // generate default wallet with mnemonic
    console.log("Generating wallet. Please wait...")
    myWallet = await generateMnemonicWallet(mnemonic)
  }
  return connected
}

async function test() {
  const allSwap = myWallet.getAllAddressesSwapSync();
  const data = await History.getAddressHistory(allSwap, 20, axia.SwapChain().getBlockchainID())
  // data.forEach((e) => {
  //   const type = e.type
  //   if (type.toString() == "import" || type == "export" || type == "pvm_export" || type == "pvm_import") {
  //     const obj = new ImportExport(e)
  //     console.log(obj)
  //     console.log(obj.amt)
  //     console.log(obj.amtText)
  //   }
  // })
  console.log(data)
}

export default {
  changeNetwork,
  getWallet,
  getBalance,
  init,
  test
};