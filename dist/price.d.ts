declare type token = {
    symbol: string;
};
declare type pair = {
    token0: token;
    token1: token;
};
declare type swap = {
    amount0In: string;
    amount0Out: string;
    amount1In: string;
    amount1Out: string;
    amountUSD: string;
    pair: pair;
    to: string;
};
/**
 *
 * @param swap
 * @param base return price in? ETH ? USD?
 * @returns
 */
export declare function getPriceFromSwap(swap: swap, baseSymbol: string): number;
export declare function getActionFromSwap(swap: swap, subject: string): string;
export {};
