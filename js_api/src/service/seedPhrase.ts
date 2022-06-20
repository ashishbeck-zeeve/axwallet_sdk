import { Mnemonic, HDNode, Buffer } from "avalanche";
import { xChain } from "../constants/networkSpect";


async function getSeedPhrase() {
    const mnemonic: Mnemonic = Mnemonic.getInstance();
    const strength: number = 256;
    const wordlist = mnemonic.getWordlists("english") as string[];
    const m: string = mnemonic.generateMnemonic(strength, null, wordlist);
    console.log(m);
    return m;
}

async function deriveAddress(seedPhrase: string) {
const mnemonic: Mnemonic = Mnemonic.getInstance(); 
const myKeychain = xChain.keyChain()
const seed: Buffer = mnemonic.mnemonicToSeedSync(seedPhrase);
const hdnode: HDNode = new HDNode(seed);

for (let i: number = 0; i <= 2; i++) {
  // Deriving the _i_th external BIP44 X-Chain address
  const child: HDNode = hdnode.derive(`m/44'/9000'/0'/0/${i}`);
  myKeychain.importKey(child.privateKeyCB58);
}

const xAddressStrings: string[] = xChain.keyChain().getAddressStrings();
console.log(xAddressStrings);
// [
//   'X-fuji1cfvdpdqyzpp8pq0g6trmjsrn9pt8nutsfm7a40',
//   'X-fuji1y75dj6qygj7frw2xtcfn724qfty4aadnmeth6y',
//   'X-fuji1p6n0vyjqgmp06f7pr405q2flqu9v93j383ncam'
// ]
return xAddressStrings;
}

export default {
    getSeedPhrase,
    deriveAddress
}