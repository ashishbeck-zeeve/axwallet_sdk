import { myWallet, syncWallet } from "./basic"
import { axChain, coreChain, swapChain } from "../constants/networkSpect";
// import { MnemonicWallet, BN, bnToAvaxX, bnToAvaxP, GasHelper, bnToAvaxC, bnToLocaleString, TxHelper } from "@avalabs/avalanche-wallet-sdk"
import { MnemonicWallet, BN, Utils, GasHelper, TxHelper, ExportChainsSwap, ExportChainsCore, ExportChainsAX } from "@axia-systems/wallet-sdk"
import { waitExportStatus } from "../utils/helpers";

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
            exportID = await wallet.exportSwapChain(new BN(amount), to as ExportChainsSwap)
            hasExported = await waitExportStatus("Swap", exportID)
            if (!hasExported) break;
            importID = to == "Core" ? await wallet.importCore("Swap") : await wallet.importAX("Swap")
            break;

        case "Core":
            exportID = await wallet.exportCoreChain(new BN(amount), to as ExportChainsCore)
            hasExported = await waitExportStatus("Core", exportID)
            if (!hasExported) break;
            importID = to == "Swap" ? await wallet.importSwap("Core") : await wallet.importAX("Core")
            break;

        case "AX":
            exportID = await wallet.exportAXChain(new BN(amount), to as ExportChainsAX)
            hasExported = await waitExportStatus("AX", exportID)
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

export default {
    getFee,
    getAdjustedGasPrice,
    getEstimatedGasLimit,
    sameChain,
    crossChain,
}