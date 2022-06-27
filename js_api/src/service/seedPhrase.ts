import { Mnemonic, HDNode, Buffer, Avalanche } from "avalanche";
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

async function utils() {

  const myNetworkID = 12345 //default is 1, we want to override that for our local network
  const avalanche = new Avalanche("localhost", 9650, "http", myNetworkID)

  // returns a reference to the X-Chain used by AvalancheJS
  const xchain = avalanche.XChain()
  
  // For C and P-Chain use methods avalanche.CChain() and avalanche.PChain()
  
  // X-Chain Keychain
  const myKeychain = xchain.keyChain()
  
  // The KeyChain has the ability to create new KeyPairs and returns the address associated with the key pair.
  const xaddress = myKeychain.makeKey()

  // Function to fetch extended keys from the master address using HD Node
  const fetchHDNode = async (address) => {
      try {
          const hdnode = new HDNode(address);
          return hdnode.derive("m/9000'/2614666'/4849181'/4660'/2"); //e.g. "m/9000'/2614666'/4849181'/4660'/2"
      } catch {
          console.log("error");
      }
  };

  // pass the address as a buffer or a string by using getAddressString()
  const hdForXChain = fetchHDNode(xaddress.getAddress());
  console.log('hd-x', hdForXChain);
  return hdForXChain;
};

export default {
    getSeedPhrase,
    deriveAddress,
    utils
}