import { BN, utils } from "@axia-systems/axiajs"
import { ONEAXC } from "@axia-systems/axiajs/dist/utils"
import { Network, Utils } from "@axia-systems/wallet-sdk"
import { NetworkProtocolType } from "@axia-systems/wallet-sdk/dist/Network/types"
import { axMainNetConfig, axTestNetConfig } from "../constants/networkConfigs"
import { axia, MIN_STAKING_AMOUNT, MIN_STAKING_DAYS } from "../constants/networkSpect"
import { GetPendingValidatorsResponse, GetValidatorsResponse, NominatorPendingRaw, NominatorRaw, ValidatorListItem, ValidatorNominatorDict, ValidatorNominatorPendingDict, ValidatorRaw } from "./txn_types/validator"

export function getNetworkConfig(config?: Object) {
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
            status = await axia.SwapChain().getTxStatus(txID)
            break;
        case "Core":
            let resp = await axia.CoreChain().getTxStatus(txID)
            if (typeof resp === 'string') {
                status = resp
            } else {
                status = resp.status
            }
            break;
        case "AX":
            status = await axia.AXChain().getAtomicTxStatus(txID)
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

export function filterValidators(data: Object) : ValidatorListItem[] {
    let validators = (data as GetValidatorsResponse).validators
    let nominators = (data as GetPendingValidatorsResponse).nominators
    let now = Date.now()
    const MINUTE_MS = 60000
    const HOUR_MS = MINUTE_MS * 60
    const DAY_MS = HOUR_MS * 24

    validators = validators.filter((v) => {
        let endTime = parseInt(v.endTime) * 1000
        let dif = endTime - now

        // If End time is less than 2 weeks + 1 hour, remove from list they are no use
        let threshold = DAY_MS * MIN_STAKING_DAYS + 15 * MINUTE_MS
        if (dif <= threshold) {
            return false
        }

        return true
    })
    let nominatorMap: ValidatorNominatorDict = nodeNominatorMap(validators)
    let nominatorPendingMap: ValidatorNominatorPendingDict = nodeNominatorPendingMap(nominators)
    let res: ValidatorListItem[] = []

    for (var i = 0; i < validators.length; i++) {
        let v = validators[i]

        let nodeID = v.nodeID

        let nominators: NominatorRaw[] = nominatorMap[nodeID] || []
        let nominatorsPending: NominatorPendingRaw[] = nominatorPendingMap[nodeID] || []

        let nominatedAmt = new BN(0)
        let nominatedPendingAmt = new BN(0)

        if (nominators) {
            nominatedAmt = nominators.reduce((acc: BN, val: NominatorRaw) => {
                return acc.add(new BN(val.stakeAmount))
            }, new BN(0))
        }

        if (nominatorsPending) {
            nominatedPendingAmt = nominatorsPending.reduce(
                (acc: BN, val: NominatorPendingRaw) => {
                    return acc.add(new BN(val.stakeAmount))
                },
                new BN(0)
            )
        }

        // let startTime = new Date(parseInt(v.startTime) * 1000)
        // let endTime = new Date(parseInt(v.endTime) * 1000)

        let nominatedStake = nominatedAmt.add(nominatedPendingAmt)
        let validatorStake = (new BN(v.stakeAmount))
        // Calculate remaining stake
        let absMaxStake = ONEAXC.mul(new BN(3000000))
        let relativeMaxStake = validatorStake.mul(new BN(5))
        let stakeLimit = BN.min(absMaxStake, relativeMaxStake)

        let remainingStake = stakeLimit.sub(validatorStake).sub(nominatedStake)

        let listItem: ValidatorListItem = {
            connection: v.connection,
            nominationFee: v.nominationFee,
            nominators: v.nominators,
            potentialReward: v.potentialReward,
            rewardOwner: v.rewardOwner,
            txID: v.txID,
            nodeID: v.nodeID,
            stakeAmount: Utils.bnToAxcCore(validatorStake),
            nominatedStake: Utils.bnToAxcCore(nominatedStake),
            remainingStake: Utils.bnToAxcCore(remainingStake),
            numNominators: nominators.length + nominatorsPending.length,
            startTime: v.startTime,
            endTime: v.endTime,
            uptime: v.uptime,
            fee: v.nominationFee,
        }
        res.push(listItem)
    }

    res = res.filter((v) => {
        // Remove if remaining space is less than minimum
        let min = new BN(MIN_STAKING_AMOUNT)
        if (Utils.numberToBNAxcCore(v.remainingStake.replace(',','')).lt(min)) return false
        return true
    })

    return res
}

function nodeNominatorMap(validators: ValidatorRaw[]): ValidatorNominatorDict {
    let res: ValidatorNominatorDict = {}
    for (var i = 0; i < validators.length; i++) {
        let validator = validators[i]
        let nodeID = validator.nodeID
        res[nodeID] = validator.nominators || []
    }
    return res
}

function nodeNominatorPendingMap(nominators: NominatorPendingRaw[]): ValidatorNominatorPendingDict {
    let res: ValidatorNominatorPendingDict = {}
    for (var i = 0; i < nominators?.length; i++) {
        let nominator = nominators[i]
        let nodeID = nominator.nodeID
        let target = res[nodeID]

        if (target) {
            res[nodeID].push(nominator)
        } else {
            res[nodeID] = [nominator]
        }
    }
    return res
}