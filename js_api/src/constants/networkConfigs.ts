import {NetworkConfig, getRpcP, getRpcC, getRpcX, } from "@avalabs/avalanche-wallet-sdk"
import { utils } from "avalanche";

export const testNetConfig: NetworkConfig = {
    rawUrl: 'https://api.avax-test.network',
    apiProtocol: 'https',
    apiIp: 'api.avax-test.network',
    apiPort: 443,
    explorerURL: 'https://explorerapi.avax-test.network',
    explorerSiteURL: 'https://explorer.avax-test.network',
    networkID: 5,
    xChainID: utils.Defaults.network[5]['X']['blockchainID'],
    pChainID: utils.Defaults.network[5]['P']['blockchainID'],
    cChainID: utils.Defaults.network[5]['C']['blockchainID'],
    evmChainID: utils.Defaults.network[5]['C']['chainID'],
    avaxID: utils.Defaults.network[5]['X']['avaxAssetID'],
    get rpcUrl() {
        return {
            c: getRpcC(this),
            p: getRpcP(this),
            x: getRpcX(this),
        };
    },
}

export const axTestNetConfig: NetworkConfig = {
    rawUrl: 'http://rpc-v2.canarytest.axiacoin.network',
    apiProtocol: 'http',
    apiIp: 'rpc-v2.canarytest.axiacoin.network',
    apiPort: 9650,
    explorerURL: 'https://explorerapi.avax-test.network',
    explorerSiteURL: 'https://explorer.avax-test.network',
    networkID: 0,
    xChainID: utils.Defaults.network[5]['X']['blockchainID'],
    pChainID: utils.Defaults.network[5]['P']['blockchainID'],
    cChainID: utils.Defaults.network[5]['C']['blockchainID'],
    evmChainID: utils.Defaults.network[5]['C']['chainID'],
    avaxID: utils.Defaults.network[5]['X']['avaxAssetID'],
    get rpcUrl() {
        return {
            c: getRpcC(this),
            p: getRpcP(this),
            x: getRpcX(this),
        };
    },
}