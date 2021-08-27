"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionFromSwap = exports.getPriceFromSwap = void 0;
/**
 *
 * @param swap
 * @param base return price in? ETH ? USD?
 * @returns
 */
function getPriceFromSwap(swap, baseSymbol) {
    const baseToken = swap.pair.token0.symbol === baseSymbol ? 0 : 1;
    let price = 0;
    if (Number(swap.amount0In) > 0) {
        if (baseToken === 0) {
            price = Number(swap.amount0In) / Number(swap.amount1Out);
        }
        else {
            price = Number(swap.amount1Out) / Number(swap.amount0In);
        }
    }
    else if (Number(swap.amount0Out) > 0) {
        if (baseToken === 0) {
            price = Number(swap.amount0Out) / Number(swap.amount1In);
        }
        else {
            price = Number(swap.amount1In) / Number(swap.amount0Out);
        }
    }
    else {
        throw new Error(`Invalid price from swap ${JSON.stringify(swap)}`);
    }
    return price;
}
exports.getPriceFromSwap = getPriceFromSwap;
function getActionFromSwap(swap, subject) {
    const baseToken = swap.pair.token0.symbol === subject ? 0 : 1;
    let action = '';
    if (Number(swap.amount0In) > 0) {
        if (baseToken == 1) {
            action = 'buy ' + subject + ' ' + Number(swap.amount1Out);
        }
        else {
            action = 'sell ' + subject + ' ' + Number(swap.amount0In);
        }
    }
    else if (Number(swap.amount0Out) > 0) {
        if (baseToken == 1) {
            action = 'sell ' + subject + ' ' + Number(swap.amount1In);
        }
        else {
            action = 'buy ' + subject + ' ' + Number(swap.amount0Out);
        }
    }
    else {
        throw new Error(`Invalid action from swap ${JSON.stringify(swap)}`);
    }
    return action;
}
exports.getActionFromSwap = getActionFromSwap;
//# sourceMappingURL=price.js.map