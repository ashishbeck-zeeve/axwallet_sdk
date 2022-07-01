import { myWallet, syncWallet } from "./basic"
import { axChain, coreChain, swapChain } from "../constants/networkSpect";
// import { MnemonicWallet, BN, bnToAvaxX, bnToAvaxP, GasHelper, bnToAvaxC, bnToLocaleString, TxHelper } from "@avalabs/avalanche-wallet-sdk"
import { MnemonicWallet, BN, Utils, GasHelper, TxHelper } from "@axia-systems/wallet-sdk"

async function getFee(chain: string, isExport: boolean) {
    if (chain === 'Swap') {
        console.log(Utils.bnToAxcSwap(swapChain.getTxFee()))
        return Utils.bnToAxcSwap(swapChain.getTxFee())
    } else if (chain === 'Core') {
        console.log(Utils.bnToAxcCore(coreChain.getTxFee()))
        return Utils.bnToAxcSwap(coreChain.getTxFee())
    } else {
        const fee = isExport
            ? GasHelper.estimateExportGasFeeFromMockTx(
                "Swap",
                new BN(1000000),
                myWallet.getAddressAX(),
                myWallet.getAddressSwap()
            )
            : GasHelper.estimateImportGasFeeFromMockTx(1, 1)
        const baseFee = await GasHelper.getBaseFeeRecommended()
        const totFeeWei = baseFee.mul(new BN(fee))
        return Utils.bnToAxcAX(totFeeWei)
    }
}

async function getAdjustedGasPrice() {
    const gasPrice = await GasHelper.getAdjustedGasPrice()
    return Utils.bnToAxcAX(gasPrice)
}

async function getEstimatedGasLimit(to: string, amount: string) {
    const gasPrice = await GasHelper.getAdjustedGasPrice()
    const gasLimit = await TxHelper.estimateAxcGas(
        myWallet.getAddressAX(),
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
    const txID = chain == "Swap" ? await wallet.sendAxcSwap(to, new BN(amount), memo) : await wallet.sendAxcAX(to, new BN(amount), gasPrice, gasLimit)
    console.log(txID)
    const data = {
        "txID": txID,
    }
    console.log(data)
    return data
}

async function crossChain(from: string, to: string, amount: string) {
    const wallet: MnemonicWallet = myWallet
    await syncWallet(wallet)
    let exportID: string
    let importID: string
    let hasExported = false
    switch (from) {
        case "Swap":
            exportID = await wallet.exportSwapChain(new BN(amount), to == "Core" ? "Core" : "AX")
            hasExported = await _waitExportStatus("Swap", exportID)
            if (!hasExported) break;
            importID = to == "Core" ? await wallet.importCore("Swap") : await wallet.importAX("Swap")
            break;

        case "Core":
            exportID = await wallet.exportCoreChain(new BN(amount), to == "Swap" ? "Swap" : "AX")
            hasExported = await _waitExportStatus("Core", exportID)
            if (!hasExported) break;
            importID = to == "Swap" ? await wallet.importSwap("Core") : await wallet.importAX("Core")
            break;

        case "AX":
            exportID = await wallet.exportAXChain(new BN(amount), to == "Core" ? "Core" : "Swap")
            hasExported = await _waitExportStatus("AX", exportID)
            if (!hasExported) break;
            importID = to == "Core" ? await wallet.importCore("AX") : await wallet.importSwap("AX")
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
        case "Swap":
            status = await swapChain.getTxStatus(txID)
            break;
        case "Core":
            let resp = await coreChain.getTxStatus(txID)
            if (typeof resp === 'string') {
                status = resp
            } else {
                status = resp.status
            }
            break;
        case "AX":
            status = await axChain.getAtomicTxStatus(txID)
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