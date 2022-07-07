import axios, { AxiosInstance } from 'axios'
import { ITransactionData } from '@axia-systems/wallet-sdk/dist/History'

// Doesn't really matter what we set, it will change
const api_url: string = 'localhost'
const explorer_api: AxiosInstance = axios.create({
    baseURL: api_url,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
    },
})

export async function getAddressHistory(
    addrs: string[],
    limit = 20,
    chainID: string,
    endTime?: string
): Promise<ITransactionData[]> {
    const ADDR_SIZE = 1024
    const selection = addrs.slice(0, ADDR_SIZE)
    const remaining = addrs.slice(ADDR_SIZE)

    const addrsRaw = selection.map((addr) => {
        return addr.split('-')[1]
    })

    const rootUrl = 'v2/transactions'

    const req = {
        address: addrsRaw,
        sort: ['timestamp-desc'],
        disableCount: ['1'],
        chainID: [chainID],
        disableGenesis: ['false'],
    }

    if (limit > 0) {
        //@ts-ignore
        req.limit = [limit.toString()]
    }

    if (endTime) {
        console.log('Setting endtime')
        //@ts-ignore
        req.endTime = [endTime]
    }

    const res = await explorer_api.post(rootUrl, req)
    let txs = res.data.transactions
    const next: string | undefined = res.data.next

    if (txs === null) txs = []

    // If we need to fetch more for this address
    if (next && !limit) {
        const endTime = next.split('&')[0].split('=')[1]
        const nextRes = await getAddressHistory(selection, limit, chainID, endTime)
        txs.push(...nextRes)
    }

    // If there are addresses left, fetch them too
    if (remaining.length > 0) {
        const nextRes = await getAddressHistory(remaining, limit, chainID)
        txs.push(...nextRes)
    }

    return txs
}