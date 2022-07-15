import { Axia, BinTools } from "@axia-systems/axiajs";
import { axTestNetConfig } from "./networkConfigs";
import { NetworkConfig } from "@axia-systems/wallet-sdk/dist/Network";
const ip: string = '1.p2p-v2.testnet.axiacoin.network'
const port: number = 443
const protocol: string = 'https'
const hrp: string = "custom"
const network_id: number = 0
const chain_id: string = 'X'
const bintools = BinTools.getInstance()
const config = axTestNetConfig
let axia: Axia = new Axia(config.apiIp, config.apiPort, config.apiProtocol, config.networkID)
// const swapChain = axia.SwapChain()
// const coreChain = axia.CoreChain()
// const axChain = axia.AXChain() 

function changeAxiaProvider(config: NetworkConfig) {
  // axia = createAxiaProvider(config)
  axia = new Axia(config.apiIp, config.apiPort, config.apiProtocol, config.networkID)

}

export {
  axia,
  bintools,
  changeAxiaProvider,
  // swapChain ,
  // coreChain ,
  // axChain ,
}