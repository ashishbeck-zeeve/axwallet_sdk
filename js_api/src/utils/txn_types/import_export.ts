import { BN } from "@axia-systems/axiajs"
import { Utils } from "@axia-systems/wallet-sdk"
import { ITransactionData } from "@axia-systems/wallet-sdk/dist/History"
import { axia } from "../../constants/networkSpect"

export class ImportExport {
    constructor(transaction: ITransactionData){
        this.transaction = transaction
    }
    transaction!: ITransactionData
    get isExport() {
        return this.transaction.type === 'export' || this.transaction.type === 'pvm_export'
    }
    get fromChainId() {
        if (!this.transaction.inputs) return '?'
        return this.transaction.inputs[0].output.chainID
    }
    get destinationChainId() {
        let outs = this.transaction.outputs
        for (var i = 0; i < outs.length; i++) {
            let out = outs[i]
            let chainId = out.chainID
            if (chainId !== this.fromChainId) {
                return chainId
            }
        }
        return this.fromChainId
    }
    // get chainId() {
    //     if (!this.isExport) {
    //         return this.transaction.outputs[0].chainID
    //     } else {
    //         return this.transaction.outputs[0].chainID
    //     }
    // }
    get chainAlias() {
        let chainId
        if (this.isExport) {
            chainId = this.fromChainId
        } else {
            chainId = this.destinationChainId
        }
        if (chainId === axia.CoreChain().getBlockchainID()) {
            return 'Core'
        } else if (chainId === axia.SwapChain().getBlockchainID()) {
            return 'Swap'
        }
        return chainId
    }
    get amt(): BN {
        if (this.isExport) {
            let outs = []
            let allOuts = this.transaction.outputs
            for (var i = 0; i < allOuts.length; i++) {
                let out = allOuts[i]
                let chainId = out.chainID
                if (chainId === this.destinationChainId) {
                    outs.push(out)
                }
            }
            let sumAmt = outs.reduce((acc, val) => {
                let amt = new BN(val.amount)
                return acc.add(amt)
            }, new BN(0))
            return sumAmt
        } else {
            let ins = this.transaction.inputs || []
            let sumAmt = ins.reduce((acc, val) => {
                let amt = new BN(val.output.amount)
                return acc.add(amt)
            }, new BN(0))
            return sumAmt
        }
        return new BN(0)
    }
    get txFee() {
        return new BN(this.transaction.txFee)
    }
    get amtText() {
        let total = this.amt.add(this.txFee)
        if (!this.isExport) {
            total = this.amt.sub(this.txFee)
        }
        let big = Utils.bnToBig(total, 9)
        return big.toLocaleString()
    }
}