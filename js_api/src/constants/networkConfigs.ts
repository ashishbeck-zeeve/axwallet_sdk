import { Network } from "@axia-systems/wallet-sdk"
import { utils } from "@axia-systems/axiajs";

export const axTestNetConfig: Network.NetworkConfig = {
    rawUrl: 'https://1.p2p-v2.testnet.axiacoin.network',
    apiProtocol: 'https',
    apiIp: '1.p2p-v2.testnet.axiacoin.network',
    apiPort: 443,
    explorerURL: 'https://magellan-v2.testnet.axiacoin.network',
    explorerSiteURL: 'https://axchain-v2.mainnet.axiacoin.network',
    networkID: 5,
    swapChainID: utils.Defaults.network[5]['Swap']['blockchainID'],
    coreChainID: utils.Defaults.network[5]['Core']['blockchainID'],
    axChainID: utils.Defaults.network[5]['AX']['blockchainID'],
    evmChainID: utils.Defaults.network[5]['AX']['chainID'],
    axcID: utils.Defaults.network[5]['Swap']['axcAssetID'],
    get rpcUrl() {
        return {
            ax: Network.getRpcAX(this),
            core: Network.getRpcCore(this),
            swap: Network.getRpcSwap(this),
        };
    },
}

export const axMainNetConfig: Network.NetworkConfig = {
    rawUrl: 'https://1.p2p-v2.mainnet.axiacoin.network',
    apiProtocol: 'https',
    apiIp: '1.p2p-v2.mainnet.axiacoin.network',
    apiPort: 443,
    explorerURL: 'https://magellan-v2.mainnet.axiacoin.network',
    explorerSiteURL: 'https://axchain-v2.mainnet.axiacoin.network',
    networkID: 1,
    swapChainID: utils.Defaults.network[1]['Swap']['blockchainID'],
    coreChainID: utils.Defaults.network[1]['Core']['blockchainID'],
    axChainID: utils.Defaults.network[1]['AX']['blockchainID'],
    evmChainID: utils.Defaults.network[1]['AX']['chainID'],
    axcID: utils.Defaults.network[1]['Swap']['axcAssetID'],
    get rpcUrl() {
        return {
            ax: Network.getRpcAX(this),
            core: Network.getRpcCore(this),
            swap: Network.getRpcSwap(this),
        };
    },
}