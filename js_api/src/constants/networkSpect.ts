// import { Avalanche } from "avalanche";
import { Axia } from "@axia-systems/axiajs";
import { testNetConfig } from "./networkConfigs";
// const ip: string = 'api.avax-test.network'
// const port: number = 443
// const protocol: string = 'https'
// const hrp: string = "fuji"
// const network_id: number = 5
// https://1.p2p-v2.testnet.axiacoin.network:443
const ip: string = '1.p2p-v2.testnet.axiacoin.network'
const port: number = 443
const protocol: string = 'https'
const hrp: string = "custom"
const network_id: number = 0
const chain_id: string = 'X'
const axia: Axia = new Axia(ip, port, protocol, network_id)
const swapChain = axia.SwapChain() // X
const coreChain = axia.CoreChain() // P
const axChain = axia.AXChain() // C

export {
  axia ,
  swapChain ,
  coreChain ,
  axChain ,
}

// export const NetworkIDToHRP = {
//   0: "custom",
//   1: "avax",
//   2: "cascade",
//   3: "denali",
//   4: "everest",
//   5: "fuji",
//   1337: "custom",
//   12345: "local",
// }