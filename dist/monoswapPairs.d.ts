/**
 * Was not working so gave up for hard coding in onRedisChain.ts for now
 * @param pairId
 * @param chainId
 * @returns
 */
export declare function fetchPairData(pairId: any, chainId: any): Promise<any>;
export declare const pairs: {
    label: string;
    exchange: string;
    marketLabel: string;
    id: string;
    liquidityProviderCount: string;
    reserve0: string;
    reserve1: string;
    reserveUSD: string;
    token0: {
        derivedETH: string;
        id: string;
        name: string;
        symbol: string;
    };
    token0Price: string;
    token1: {
        derivedETH: string;
        id: string;
        name: string;
        symbol: string;
    };
    token1Price: string;
    trackedReserveETH: string;
    txCount: string;
    volumeUSD: string;
}[];
