import { myWallet, syncWallet } from "./basic"
import { cChain, pChain, xChain } from "../constants/networkSpect";
import { MnemonicWallet, BN, bnToAvaxX, bnToAvaxP, GasHelper, bnToAvaxC, bnToLocaleString, TxHelper } from "@avalabs/avalanche-wallet-sdk"

async function getFee(chain: string, isExport: boolean) {
    if (chain === 'X') {
        console.log(bnToAvaxX(xChain.getTxFee()))
        return bnToAvaxX(xChain.getTxFee())
    } else if (chain === 'P') {
        console.log(bnToAvaxP(pChain.getTxFee()))
        return bnToAvaxX(pChain.getTxFee())
    } else {
        const fee = isExport
            ? GasHelper.estimateExportGasFeeFromMockTx(
                "X",
                new BN(1000000),
                myWallet.getAddressC(),
                myWallet.getAddressX()
            )
            : GasHelper.estimateImportGasFeeFromMockTx(1, 1)
        const baseFee = await GasHelper.getBaseFeeRecommended()
        const totFeeWei = baseFee.mul(new BN(fee))
        return bnToAvaxC(totFeeWei)
    }
}

async function getAdjustedGasPrice() {
    const gasPrice = await GasHelper.getAdjustedGasPrice()
    return bnToAvaxC(gasPrice)
}

async function getEstimatedGasLimit(to: string, amount: string) {
    const gasPrice = await GasHelper.getAdjustedGasPrice()
    const gasLimit = await TxHelper.estimateAvaxGas(
        myWallet.getAddressC(),
        to,
        new BN(amount),
        gasPrice
    )
    return gasLimit
}

async function sameChain(to: string, amount: string, chain: string, memo?: string) {
    const wallet: MnemonicWallet = myWallet
    await syncWallet(wallet)
    //const gasPrice = parseInt(await cChain.getBaseFee(), 16)
    const gasPrice = await GasHelper.getAdjustedGasPrice()
    const gasLimit = await getEstimatedGasLimit(to, amount)
    const txID = chain == "X" ? await wallet.sendAvaxX(to, new BN(amount), memo) : await wallet.sendAvaxC(to, new BN(amount), gasPrice, gasLimit)
    console.log(txID)
    const data = {
        "txID": txID,
    }
    console.log(data)
    return data
}

// add import fee to amount from UI
async function crossChain(from: string, to: string, amount: string) {
    const wallet: MnemonicWallet = myWallet
    await syncWallet(wallet)
    let exportID: string
    let importID: string
    let hasExported = false
    switch (from) {
        case "X":
            exportID = await wallet.exportXChain(new BN(amount), to == "P" ? "P" : "C")
            hasExported = await _waitExportStatus("X", exportID)
            if (!hasExported) break;
            importID = to == "P" ? await wallet.importP("X") : await wallet.importC("X")
            break;

        case "P":
            exportID = await wallet.exportPChain(new BN(amount), to == "X" ? "X" : "C")
            hasExported = await _waitExportStatus("P", exportID)
            if (!hasExported) break;
            importID = to == "X" ? await wallet.importX("P") : await wallet.importC("P")
            break;

        case "C":
            exportID = await wallet.exportCChain(new BN(amount), to == "P" ? "P" : "X")
            hasExported = await _waitExportStatus("C", exportID)
            if (!hasExported) break;
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

async function _waitExportStatus(chain: string, txID: string, remainingTries = 15): Promise<boolean> {
    let status
    switch (chain) {
        case "X":
            status = await xChain.getTxStatus(txID)
            break;
        case "P":
            let resp = await pChain.getTxStatus(txID)
            if (typeof resp === 'string') {
                status = resp
            } else {
                status = resp.status
            }
            break;
        case "C":
            status = await cChain.getAtomicTxStatus(txID)
            break;

        default:
            break;
    }
    const asd = JSON.stringify(status)
    console.log(asd)
    console.log(status)
    if (status === 'Unknown' || status === 'Processing') {
        // If out of tries
        if (remainingTries <= 0) {
            // Timed out
            return false
        }
        // if not confirmed ask again
        setTimeout(() => {
            console.log("Retrying (" + remainingTries + ")")
            this._exportStatus(chain, txID, remainingTries - 1)
        }, 1000)
        return false
    } else if (status === 'Dropped') {
        // If dropped stop the process
        return false
    } else {
        // If success start import
        return true
    }

}

export default {
    getFee,
    getAdjustedGasPrice,
    getEstimatedGasLimit,
    sameChain,
    crossChain,
}