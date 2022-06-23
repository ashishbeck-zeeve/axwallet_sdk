import { myWallet, syncWallet } from "./basic"
import { cChain } from "../constants/networkSpect";
import { MnemonicWallet, BN } from "@avalabs/avalanche-wallet-sdk"

async function sameChain(to: string, amount: string, chain: string, memo?: string) {
    const wallet: MnemonicWallet = myWallet
    await syncWallet(wallet)
    const gasPrice = parseInt(await cChain.getBaseFee(), 16)
    const txID = chain == "X" ? await wallet.sendAvaxX(to, new BN(amount), memo) : await wallet.sendAvaxC(to, new BN(amount), new BN(gasPrice), 21000)
    console.log(txID)
    return txID
}

async function crossChain(from: string, to: string, amount: string) {
    const wallet: MnemonicWallet = myWallet
    await syncWallet(wallet)
    let exportID: string
    let importID: string
    switch (from) {
        case "X":
            exportID = await wallet.exportXChain(new BN(amount), to == "P" ? "P" : "C")
            importID = to == "P" ? await wallet.importP("X") : await wallet.importC("X")
            break;

        case "P":
            exportID = await wallet.exportPChain(new BN(amount), to == "X" ? "X" : "C")
            importID = to == "X" ? await wallet.importX("P") : await wallet.importC("P")
            break;

        case "C":
            exportID = await wallet.exportCChain(new BN(amount), to == "P" ? "P" : "X")
            importID = to == "P" ? await wallet.importP("C") : await wallet.importX("C")
            break;

        default:
            break;
    }
    const data = {
        "exportID": exportID,
        "importID": importID
    }
    console.log(data)
    return data
}

export default {
    sameChain,
    crossChain
}