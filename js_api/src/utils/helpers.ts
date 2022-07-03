import { utils } from "@axia-systems/axiajs"
import { Network } from "@axia-systems/wallet-sdk"
import { NetworkProtocolType } from "@axia-systems/wallet-sdk/dist/Network/types"
import { axTestNetConfig } from "../constants/networkConfigs"
import { axChain, coreChain, swapChain } from "../constants/networkSpect"

export function getNetworkConfig(config?: Object) {
    // https://1.p2p-v2.testnet.axiacoin.network:433
    if (config == null) return axTestNetConfig
    const url: string = config['url']
    const splitURL: Array<string> = url.split(":")
    const protocol: NetworkProtocolType = url.split("://")[0] as NetworkProtocolType
    const ip = splitURL[1].substring(2)
    const port = parseInt(splitURL[2])
    splitURL.pop()
    const rawURL = splitURL.join(":")
    const network: Network.NetworkConfig = {
        rawUrl: rawURL,
        apiProtocol: protocol,
        apiIp: ip,
        apiPort: port,
        explorerURL: config['explorerURL'],
        explorerSiteURL: config['explorerSiteURL'],
        networkID: config['networkID'],
        swapChainID: utils.Defaults.network[config['networkID']]['Swap']['blockchainID'],
        coreChainID: utils.Defaults.network[config['networkID']]['Core']['blockchainID'],
        axChainID: utils.Defaults.network[config['networkID']]['AX']['blockchainID'],
        evmChainID: utils.Defaults.network[config['networkID']]['AX']['chainID'],
        axcID: utils.Defaults.network[config['networkID']]['Swap']['axcAssetID'],
        get rpcUrl() {
            return {
                ax: Network.getRpcAX(this),
                core: Network.getRpcCore(this),
                swap: Network.getRpcSwap(this),
            };
        },
    };
    return network;
}

export async function waitExportStatus(chain: string, txID: string, remainingTries = 15): Promise<boolean> {
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