interface token {
    chainId: number;
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}
declare type SwapToken = {
    decimals: number;
    symbol: string;
    name: string;
    chainId: number;
    address: string;
};
export default class Sdk {
    chainId: number;
    sdk: {
        Token: any;
        Route: any;
        Pair: any;
        Fetcher: any;
        Trade: any;
        WETH: any;
        TokenAmount: any;
        TradeType: any;
    };
    constructor(chainId: number);
    getSwapSdk(chainId: any): void;
    createToken(chainId: any, address: any, symbol: any, name: any, decimals: any): any;
    getSwapToken(token: token): any;
    getPrice(pair: any, token: any, chainId: any): number;
    getExecutionPrice(pair: any, token: SwapToken, amount: any): any;
    getPair(token0: any, token1: any, provider: any, chainId: any): Promise<any>;
}
export {};
