import { axia, bintools } from "../constants/networkSpect"
import makeBlockie from 'ethereum-blockies-base64';

function checkAddrValidity(addr: string) {
    try {
        let res = bintools.stringToAddress(addr)
    } catch (err) {
        return false
    }
    if (!addr.startsWith("0x")) {
        let hrp = axia.getHRP()
        if (!addr.includes(hrp)) {
            return false
        }
        return true
    }
    return true
}

export function getIdenticon(addr:string) {
    const img = makeBlockie(addr)
    return img
}

export default {
    checkAddrValidity,
    getIdenticon,
}