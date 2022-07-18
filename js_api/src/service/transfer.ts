import { myWallet, syncWallet } from "./basic"
import { axia } from "../constants/networkSpect";
import { MnemonicWallet, BN, Utils, GasHelper, TxHelper, ExportChainsSwap, ExportChainsCore, ExportChainsAX, History } from "@axia-systems/wallet-sdk"
import { waitExportStatus } from "../utils/helpers";
import { ImportExport } from "../utils/txn_types/import_export";

async function getFee(chain: string, isExport: boolean) {
    if (chain === 'Swap') {
        // console.log(Utils.bnToAxcSwap(axia.SwapChain().getTxFee()))
        return Utils.bnToAxcSwap(axia.SwapChain().getTxFee())
    } else if (chain === 'Core') {
        // console.log(Utils.bnToAxcCore(axia.CoreChain().getTxFee()))
        return Utils.bnToAxcSwap(axia.CoreChain().getTxFee())
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

async function getEstimatedGasLimit(to: string, amount: string, gas?: BN) {
    const amtAX = Utils.numberToBNAxcAX(amount)
    const gasPrice = gas ?? await GasHelper.getAdjustedGasPrice()
    const gasLimit = await TxHelper.estimateAxcGas(
        myWallet.getAddressAX(),
        to,
        amtAX,
        gasPrice
    )
    return gasLimit
}

async function sameChain(to: string, amount: string, chain: string, memo?: string) {
    try {
        const wallet: MnemonicWallet = myWallet
        await syncWallet(wallet)
        //const gasPrice = parseInt(await cChain.getBaseFee(), 16)
        const gasPrice = chain == "AX" ? await GasHelper.getAdjustedGasPrice() : new BN(0)
        const gasLimit = chain == "AX" ? await getEstimatedGasLimit(to, amount, gasPrice) : 0
        const amtSwap = Utils.numberToBNAxcSwap(amount)
        const amtAX = Utils.numberToBNAxcAX(amount)
        const txID = chain == "Swap" ? await wallet.sendAxcSwap(to, amtSwap, memo) : await wallet.sendAxcAX(to, amtAX, gasPrice, gasLimit)
        console.log(txID)
        const data = {
            "txID": txID,
        }
        console.log(data)
        return data
    } catch (err) {
        (<any>window).send("log", { error: err.message });
        return err.message;
    }
}

async function crossChain(from: string, to: string, amount: string) {
    try {
        const wallet: MnemonicWallet = myWallet
        await syncWallet(wallet)
        let exportID: string
        let importID: string
        let hasExported = false
        // Import fees of the destination chain needed to be added manually
        const importFees = await getFee(to, false)
        const amtBN = Utils.numberToBNAxcSwap(amount).add(Utils.numberToBNAxcSwap(importFees))
        switch (from) {
            case "Swap":
                exportID = await wallet.exportSwapChain(amtBN, to as ExportChainsSwap)
                hasExported = await waitExportStatus("Swap", exportID)
                if (!hasExported) break;
                importID = to == "Core" ? await wallet.importCore("Swap") : await wallet.importAX("Swap")
                break;
    
            case "Core":
                exportID = await wallet.exportCoreChain(amtBN, to as ExportChainsCore)
                hasExported = await waitExportStatus("Core", exportID)
                if (!hasExported) break;
                importID = to == "Swap" ? await wallet.importSwap("Core") : await wallet.importAX("Core")
                break;
    
            case "AX":
                exportID = await wallet.exportAXChain(amtBN, to as ExportChainsAX)
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
    } catch (err) {
        (<any>window).send("log", { error: err.message });
        return err.message;
    }
}

async function getTransactions() {
    const allSwap = myWallet.getAllAddressesSwapSync();
    const allCore = myWallet.getAllAddressesCoreSync();
    const allAddr = allSwap.concat(allCore)
    // console.log(allSwap)
    // console.log(allCore)
    // console.log(axia.SwapChain().getBlockchainID())
    // console.log(axia.CoreChain().getBlockchainID())
    const [swapTxn, coreTxn] = await Promise.all([
        History.getAddressHistory(allSwap, 20, axia.SwapChain().getBlockchainID()),
        History.getAddressHistory(allCore, 20, axia.CoreChain().getBlockchainID())
    ])
    // const swapTxn = await History.getAddressHistory(allSwap, 20, axia.SwapChain().getBlockchainID())
    // const coreTxn = await History.getAddressHistory(allCore, 20, axia.CoreChain().getBlockchainID())

    // const summary = await History.getTransactionSummary(swapTxn[0], allSwap, myWallet.getAddressAX())
    // const strfied = JSON.parse(JSON.stringify(summary))
    // console.log(strfied)
    // console.log(Utils.bnToAxcSwap(summary.fee))
    // console.log((strfied["fee"]))
    // console.log((strfied["amountDisplayValue"]))
    const txns = swapTxn.concat(coreTxn).sort((a, b) => {
        return (Date.parse(a.timestamp) < Date.parse(b.timestamp)) ? 1 : -1;
    })
    console.log(txns)
    let i = 1;
    let data = []
    // txns.forEach((e) => {

    //   e.inputs.forEach((x) => console.log(x.output.amount))
    //   i++
    // })
    for await (var item of txns) {
        let map = {}
        const summary = await History.getTransactionSummary(item, allAddr, myWallet.getAddressAX())
        map["id"] = summary.id
        map["type"] = summary.type
        map["timestamp"] = summary.timestamp.valueOf()
        map["memo"] = summary.memo
        map["fee"] = Utils.bnToAxcSwap(summary.fee)
        if (History.isHistoryImportExportTx(summary)) {
            map["amount"] = summary.amountDisplayValue
            map["amountL"] = Utils.bnToAxcSwap(summary.amount)
            map["source"] = summary.source
            map["destination"] = summary.destination
            // This is needed because the API doesn't calculate the "amount" for AX related txns accurately
            const IETxn = new ImportExport(item)
            map["amount"] = IETxn.amtText
            map["fee"] = Utils.bnToAxcSwap(IETxn.txFee)
        }
        if (History.isHistoryBaseTx(summary)) {
            map["tokens"] = summary.tokens
        }
        if (History.isHistoryStakingTx(summary)) {
            map["stakeStart"] = summary.stakeStart
            map["stakeEnd"] = summary.stakeEnd
            map["nodeID"] = summary.nodeID
            map["amount"] = summary.amountDisplayValue
            map["amountL"] = Utils.bnToAxcSwap(summary.amount)
            map["isRewarded"] = summary.isRewarded
            map["rewardAmount"] = summary.rewardAmountDisplayValue
        }
        if (History.isHistoryEVMTx(summary)) {
            map["amount"] = summary.amountDisplayValue
            map["amountL"] = Utils.bnToAxcSwap(summary.amount)
            map["from"] = summary.from
            map["to"] = summary.to
            map["isSender"] = summary.isSender
        }
        // const objectified = JSON.parse(JSON.stringify(summary))
        // console.log(objectified["fee"])
        // objectified["fee"] = Utils.bnToAxcSwap(new BN(parseInt(objectified["fee"], 16)))
        // console.log(summary)
        // console.log(JSON.parse(JSON.stringify(summary)))
        data.push(map)
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
    getTransactions,
}