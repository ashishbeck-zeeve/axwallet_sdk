import { Avalanche } from "avalanche";
import { testNetConfig } from "./networkConfigs";
const ip: string = 'api.avax-test.network'
const port: number = 443
const protocol: string = 'https'
const hrp: string = "fuji"
const network_id: number = 5
// const ip: string = 'rpc-v2.canarytest.axiacoin.network'
// const port: number = 9650
// const protocol: string = 'http'
// const hrp: string = "custom"
// const network_id: number = 0
const chain_id: string = 'X'
const avalanche: Avalanche = new Avalanche(ip, port, protocol, network_id, chain_id)
const xChain = avalanche.XChain() // X
const pChain = avalanche.PChain() // P
const cChain = avalanche.CChain() // C

export {
  avalanche,
  xChain,
  pChain,
  cChain,
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