import { axia, assetChain, coreChain, appChain } from "../constants/networkSpect";
import { BinTools, Mnemonic } from "@zee-ava/avajs"
import HDNode from "@zee-ava/avajs/dist/utils/hdnode"

async function getBalance(addr?: string) {
  var bal = await assetChain.getBalance(addr == null ? "X-fuji1ga5ayv3elufyrmc3j83sau43vmwra9nvyc5mvx" : addr, "AVAX");
  // var bal = await coreChain.getBalance("P-fuji1ga5ayv3elufyrmc3j83sau43vmwra9nvyc5mvx");
  // var bal = await appChain.getAssetBalance("0x3f3bc634bac77e34cb4aaae1133a8238390b054e", "0", "AVAX");
  console.log("balance is");
  console.log(JSON.stringify(bal));
  console.log("eof");
}

async function createKeychain() {
  const myKeychain = assetChain.keyChain()
  // const bintools = BinTools.getInstance()
  // const mypk = bintools.cb58Decode(
  //   "JaCCSxdoWfo3ao5KwenXrJjJR7cBTQ287G1C5qpv2hr2tCCdb"
  // ) // returns a Buffer
  // const newAddress2 = myKeychain.importKey(mypk)
  // const addresses = myKeychain.getAddresses() // returns an array of Buffers for the addresses
  // const addressStrings = myKeychain.getAddressStrings() // returns an array of strings for the addresses
  // const exists = myKeychain.hasKey(addresses[0]) // returns true if the address is managed
  // const keypair = myKeychain.getKey(addresses[0]) // returns the KeyPair class
  // console.log(newAddress2)
  // console.log(addresses)
  // console.log(addressStrings)
  // console.log(exists)
  // console.log(keypair)
  const mnemonic: Mnemonic = Mnemonic.getInstance();
  const seed = mnemonic.mnemonicToSeedSync("item ask cook trumpet foil glance unique outdoor erode address long actual century match valve finish bacon travel uncover pyramid nature balcony purse silk");
  const hdnode: HDNode = new HDNode(seed);

  // Deriving the _i_th external BIP44 X-Chain address
  for (let i: number = 0; i <= 0; i++) {
    // Deriving the _i_th external BIP44 X-Chain address
    const child: HDNode = hdnode.derive(`m/44'/9000'/0'/0/${i}`);
    myKeychain.importKey(child.privateKeyCB58);
  }
  const xAddressStrings: string[] = myKeychain.getAddressStrings();
  console.log(xAddressStrings);

  const child: HDNode = hdnode.derive(`m/44'/60'/0'/0/0`);
  myKeychain.importKey(child.privateKeyCB58)
  const appAddresses = myKeychain.getAddressStrings()
  console.log(appAddresses)
}

export default {
  getBalance,
  createKeychain,
};