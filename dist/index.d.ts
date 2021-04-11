import * as ethers from 'ethers';
export declare function getProvider(network: any): ethers.ethers.providers.JsonRpcProvider;
export declare function getNetworkFromChainId(chainId: number): "xdaiChain" | "mainnet" | "ropstem" | "bsc";
export declare function getOurTokenList(): {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}[];
export declare function getTokenPrices(symbol: string, baseSymbols: string[], chainId: number): Promise<number[]>;
export declare function getTokenPricesFromAddress(address: string, baseSymbols: string[], chainId: number): Promise<number[]>;
/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
export declare function getTokenPriceFromAddress(address: string, baseSymbol: string, chainId: number, symbol?: string): Promise<number>;
/**
 * Get Token details
 */
export declare function getTokenFromList(symbol: string, chainId: number): {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
};
export declare function getPairFromAddresses(addresses: string[], chainId: number): Promise<any>;
export declare function getPairFromSymbols(symbol: string, baseSymbol: string, chainId: number): Promise<any>;
export declare function getTokenPriceFromSdk(pair: any, token: any, chainId: number): Promise<number>;
export declare function getTokenPriceFromEthPrice(fromSymbol: string, toSymbol: string, chainId: number, timestamp: number): Promise<number>;
export declare function getTokenPrice(symbol: string, baseSymbol: string, chainId: number): Promise<number>;
export declare function convertPriceUsdToEth(priceInUsd: any, timeStamp: any): Promise<number>;
export declare function convertPriceEthToUsd(priceInEth: any, timeStamp: any): Promise<number>;
/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
export declare function getTokenExecutionPriceFromAddress(address: string, baseSymbol: string, chainId: number, amount: number): Promise<any>;
export declare function getPriceAtTime(from: string, to: string, timestamp: number, chainId: number): Promise<number>;
/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
export declare function getTokenExecutionPrice(symbol: string, baseSymbol: string, chainId: number, amount: number): Promise<any>;
