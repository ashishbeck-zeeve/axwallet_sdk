import { Mnemonic, HDNode, BinTools,  Buffer as BufferAvalanche} from "avalanche";
import { pChain, xChain, cChain } from "../constants/networkSpect";
import { MnemonicWallet } from "@avalabs/avalanche-wallet-sdk"
import { privateToAddress } from 'ethereumjs-util'

export async function genSeedPhrase() {
    const mnemonic: Mnemonic = Mnemonic.getInstance();
    const strength: number = 256;
    const wordlist = mnemonic.getWordlists("english") as string[];
    const m: string = mnemonic.generateMnemonic(strength, null, wordlist);
    console.log(m);
    return m;
}

async function generateMnemonicWallet(mnemonic: string) {
  const wallet = MnemonicWallet.fromMnemonic(mnemonic)
  await wallet.resetHdIndices()
  console.log("Wallet generated")
  return wallet;
}

export async function getWalletAddresses(seedPhrase: string) {
    const wallet: MnemonicWallet = await generateMnemonicWallet(seedPhrase)
    const xKeychain = xChain.keyChain()
    const mnemonic: Mnemonic = Mnemonic.getInstance();
    const seed = mnemonic.mnemonicToSeedSync(wallet.getMnemonic());
    const hdnode: HDNode = new HDNode(seed);

    // Deriving the _i_th external BIP44 X-Chain address
    const child: HDNode = hdnode.derive(`m/44'/9000'/0'/0/0`);
    const childC: HDNode = hdnode.derive(`m/44'/60'/0'/0/0`);

    xKeychain.importKey(child.privateKeyCB58);
    

    let ethPrivateKey = childC.privateKey.toString('hex')
    let ethAddress = privateToAddress(childC.privateKey).toString('hex')
    let cPrivKey = `PrivateKey-` + BinTools.getInstance().cb58Encode(BufferAvalanche.from(childC.privateKey))

    console.log("xChain addresses")
    console.log(xKeychain.getAddressStrings())
    console.log(child.publicExtendedKey) // remove last two /0/0 to get correct xpub

    console.log("cChain addresses")
    console.log(ethPrivateKey)
    console.log(ethAddress)
    console.log(cPrivKey)

    const x = wallet.getAddressX()
    const p = wallet.getAddressP()
    const c = wallet.getAddressC()
    const data = {
      "X": x,
      "P": p,
      "C": c,
    }
    return data
  }

export default {
    genSeedPhrase,
    getWalletAddresses,
}