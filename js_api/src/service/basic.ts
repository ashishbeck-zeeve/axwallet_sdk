import { axChain, coreChain, swapChain } from "../constants/networkSpect";
// import { BinTools, Mnemonic, HDNode, BN } from "avalanche"
// import { bnToAvaxC, bnToAvaxP, bnToAvaxX, MnemonicWallet, setNetworkAsync, MainnetConfig, GasHelper } from "@avalabs/avalanche-wallet-sdk"
import { Utils, MnemonicWallet, Network, GasHelper, NetworkConstants } from "@axia-systems/wallet-sdk"
import { getNetworkConfig } from "../utils/helpers";
import { NetworkConfig } from "@axia-systems/wallet-sdk/dist/Network";
import { getAddressHistory } from "../utils/txn_api";

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
  const network: Network.NetworkConfig = getNetworkConfig(config)
  try {
    await Network.setNetworkAsync(network)
    console.log("Successfully changed to " + network.rawUrl)
    // return network.apiProtocol + "://" + network.apiIp + ":" + network.apiPort
    return true
  } catch (e) {
    console.log("Failed to change network")
    return false
  }
}

async function getWallet() {
  const wallet: MnemonicWallet = myWallet // await generateMnemonicWallet(mnemonic)
  await syncWallet(wallet)
  // console.log("all addresses")
  // console.log(wallet.getAllAddressesPSync())
  // console.log(await wallet.getAllAddressesP())
  // console.log("change address")
  // console.log(wallet.getChangeAddressX())
  // console.log("external addresses")
  // console.log(wallet.getExternalAddressesXSync())
  // console.log(wallet.getExternalAddressesPSync())
  // console.log("internal addresses")
  // console.log(wallet.getInternalAddressesXSync())
  // console.log(await wallet.getInternalAddressesX())
  // const myKeychain = pChain.keyChain()
  // const mnemonic: Mnemonic = Mnemonic.getInstance();
  // const seed = mnemonic.mnemonicToSeedSync(myWallet.getMnemonic());
  // const hdnode: HDNode = new HDNode(seed);
  // // Deriving the _i_th external BIP44 X-Chain address
  // const child: HDNode = hdnode.derive(`m/44'/9000'/0'/0/0`);
  // myKeychain.importKey(child.privateKeyCB58);
  // const pAddressStrings: string[] = myKeychain.getAddressStrings();
  // console.log(pAddressStrings)
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
  console.log(data)
  return data
}

async function getBalance() {
  const wallet: MnemonicWallet = myWallet // await generateMnemonicWallet(mnemonic)
  await syncWallet(wallet)
  const bal = wallet.getAxcBalance();
  const swapBal = Utils.bnToAxcSwap(bal.Swap.unlocked);
  const coreBal = Utils.bnToAxcCore(bal.Core.unlocked);
  const axBal = Utils.bnToAxcAX(bal.AX);
  console.log([swapBal, coreBal, axBal])
  const staked = Utils.bnToAxcCore((await wallet.getStake()).staked)
  console.log(staked)
  return {
    "swap": swapBal,
    "core": coreBal,
    "ax": axBal,
    "staked": staked,
  }
}

async function init(mnemonic?: string, network?: NetworkConfig) {
  // set test net by default
  const connected = await changeNetwork(network)

  if (mnemonic != null) {
    // generate default wallet with mnemonic
    console.log("Generating wallet. Please wait...")
    myWallet = await generateMnemonicWallet(mnemonic)
  }
  return connected
}

async function test() {
  const allSwap = myWallet.getAllAddressesSwapSync();
  const history = await getAddressHistory(allSwap, 20, swapChain.getBlockchainID())
  console.log(history.length)
  history.forEach((e) => console.log(e))
}

// async function createKeychain() {
//   // const wallet: MnemonicWallet = MnemonicWallet.fromMnemonic("item ask cook trumpet foil glance unique outdoor erode address long actual century match valve finish bacon travel uncover pyramid nature balcony purse silk")
//   // const wallet: MnemonicWallet = MnemonicWallet.fromMnemonic("heart tide base sand flush list monster health achieve expire cup style bike slab day inner news afraid stay vague floor away wash minute")
//   // // wallet.
//   // // console.log(JSON.stringify(wallet))
//   // await Promise.all([
//   //   await wallet.updateAvaxBalanceC(),
//   //   await wallet.updateUtxosP(),
//   //   await wallet.updateUtxosX(),
//   // ])
//   // const bal = wallet.getAvaxBalance();
//   // const xBal = bal.X;
//   // const pBal = bal.P;
//   // const cBal = bal.C;
//   // console.log(bnToAvaxX(xBal.unlocked))
//   // console.log(bnToAvaxP(pBal.unlocked))
//   // console.log(bnToAvaxC(cBal))
//   // console.log(JSON.stringify(bal))
//   // console.log(JSON.stringify(wallet.getAvaxBalanceC()))
//   // const priv = wallet.getEvmPrivateKeyHex();
//   // const evmwallet = wallet.evmWallet;
//   // const evmpriv = evmwallet.getPrivateKeyHex();
//   // const privateKey = evmwallet.getKeyPair().getPrivateKeyString();
//   // console.log(priv)
//   // console.log(wallet.getAllAddressesPSync())
//   // console.log(wallet.getAllAddressesXSync())
//   // console.log(wallet.getAddressX())
//   // console.log(wallet.getAddressP())
//   // console.log(wallet.getAddressC())
//   // console.log(evmpriv)
//   // console.log(privateKey)
//   const myKeychain = pChain.keyChain()
//   const bintools = BinTools.getInstance()
//   const mypk = bintools.cb58Decode(
//     "JaCCSxdoWfo3ao5KwenXrJjJR7cBTQ287G1C5qpv2hr2tCCdb"
//   ) // returns a Buffer
//   const newAddress2 = myKeychain.importKey(mypk)
//   const addresses = myKeychain.getAddresses() // returns an array of Buffers for the addresses
//   const addressStrings = myKeychain.getAddressStrings() // returns an array of strings for the addresses
//   const exists = myKeychain.hasKey(addresses[0]) // returns true if the address is managed
//   const keypair = myKeychain.getKey(addresses[0]) // returns the KeyPair class
//   console.log(newAddress2)
//   console.log(addresses)
//   console.log(addressStrings)
//   console.log(exists)
//   console.log(keypair)
//   const mnemonic: Mnemonic = Mnemonic.getInstance();
//   const seed = mnemonic.mnemonicToSeedSync("item ask cook trumpet foil glance unique outdoor erode address long actual century match valve finish bacon travel uncover pyramid nature balcony purse silk");
//   const hdnode: HDNode = new HDNode(seed);

//   // Deriving the _i_th external BIP44 X-Chain address
//   for (let i: number = 0; i <= 0; i++) {
//     // Deriving the _i_th external BIP44 X-Chain address
//     const child: HDNode = hdnode.derive(`m/44'/9000'/0'/0/${i}`);
//     myKeychain.importKey(child.privateKeyCB58);
//   }
//   const xAddressStrings: string[] = myKeychain.getAddressStrings();
//   console.log(xAddressStrings);

//   const child: HDNode = hdnode.derive(`m/44'/60'/0'/0/0`);
//   myKeychain.importKey(child.privateKeyCB58)
//   const appAddresses = myKeychain.getAddressStrings()
//   console.log(appAddresses)
// }

export default {
  changeNetwork,
  getWallet,
  getBalance,
  init,
  test
};