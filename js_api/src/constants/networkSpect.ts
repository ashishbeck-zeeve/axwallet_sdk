import { Axia } from "@zee-ava/avajs";
const ip: string = 'api.avax-test.network'
const port: number = 443
const protocol: string = 'https'
const hrp: string = "fuji"
// const ip: string = 'rpc-v2.canarytest.axiacoin.network'
// const port: number = 9650
// const protocol: string = 'http'
// const hrp: string = "custom"
const network_id: number = 2
const chain_id: string = 'X'
const axia: Axia = new Axia(ip, port, protocol, network_id, null, null, hrp)
const assetChain = axia.AssetChain() // X
const coreChain = axia.CoreChain() // P
const appChain = axia.AppChain() // C

export {
  axia,
  assetChain,
  coreChain,
  appChain,
}