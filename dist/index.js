"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = __importDefault(require("./sdk"));
const ethers_1 = __importDefault(require("ethers"));
const config_1 = __importDefault(require("./config"));
const tokenLists_1 = require("./tokenLists");
const theGraph_1 = require("./theGraph");
const price_1 = require("./price");
const INFURA_ID = config_1.default.get('ETHEREUM_NODE_ID');
function getProvider(network) {
    if (network === 'xdaiChain') {
        console.log(`config.get('XDAI_NODE_HTTP_URL') ---> : ${config_1.default.get('XDAI_NODE_HTTP_URL')}`);
        return new ethers_1.default.providers.JsonRpcProvider(config_1.default.get('XDAI_NODE_HTTP_URL').toString());
    }
    return new ethers_1.default.providers.InfuraProvider(network, INFURA_ID);
}
function getNetworkFromChainId(chainId) {
    if (chainId === 1) {
        return 'mainnet';
    }
    else if (chainId === 100) {
        return 'xdaiChain';
    }
    else if (chainId === 3) {
        return 'ropstem';
    }
    else {
        throw new Error('Invalid chainId');
    }
}
function getOurTokenList() {
    return tokenLists_1.allTokens;
}
exports.getOurTokenList = getOurTokenList;
function getTokenPrices(symbol, baseSymbols, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const pricePromises = baseSymbols.map(base => getTokenPrice(symbol, base, chainId));
            Promise.all(pricePromises)
                .then((prices) => {
                resolve(prices);
            })
                .catch(reject);
        });
    });
}
exports.getTokenPrices = getTokenPrices;
function getTokenPricesFromAddress(address, baseSymbols, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const pricePromises = baseSymbols.map(base => getTokenPriceFromAddress(address, base, chainId));
            Promise.all(pricePromises)
                .then((prices) => {
                resolve(prices);
            })
                .catch(reject);
        });
    });
}
exports.getTokenPricesFromAddress = getTokenPricesFromAddress;
/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
function getTokenPriceFromAddress(address, baseSymbol, chainId, symbol = 'Dunno') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sdk = new sdk_1.default(chainId);
            const token = yield getTokenFromAddress(address, chainId);
            const baseTokenFromList = yield getTokenFromList(baseSymbol, chainId);
            //const baseToken = await getTokenFromAddress(address, chainId)
            const baseToken = yield sdk.getSwapToken(baseTokenFromList);
            if (!baseToken)
                throw Error(`BaseSymbol ${baseSymbol} not found in our token list`);
            if (address === baseToken.address)
                return 1;
            const provider = getProvider(getNetworkFromChainId(chainId));
            const pair = yield sdk.getPair(token, baseToken, provider, chainId);
            return yield sdk.getPrice(pair, token, chainId);
        }
        catch (error) {
            console.log(`Warning, no price for:  ---> : ${address}, ${baseSymbol} - ${chainId}`);
            // There may be no pair so return 0
            // console.error(error)
            // throw new Error(error)
        }
    });
}
exports.getTokenPriceFromAddress = getTokenPriceFromAddress;
/**
 * Get Token details
 */
function getTokenFromList(symbol, chainId) {
    const inSymbol = symbol.toUpperCase() === 'ETH' ? 'WETH' : symbol.toUpperCase();
    const token = tokenLists_1.allTokens.find(o => o.symbol === inSymbol && o.chainId === chainId);
    if (!token)
        throw new Error(`Token ${inSymbol} not found`);
    return token;
}
exports.getTokenFromList = getTokenFromList;
function isTestPrice(symbol, baseSymbol) {
    return ((symbol === 'ETH' && baseSymbol === 'USDT') ||
        (symbol === 'ETH' && baseSymbol === 'ETH'));
}
function isETHisETH(symbol, baseSymbol) {
    return symbol === 'ETH' && baseSymbol === 'ETH';
}
function getTestPrice(symbol, baseSymbol, chainId) {
    console.log(`symbol ---> : ${symbol}`);
    console.log(`baseSymbol ---> : ${baseSymbol}`);
    console.log(`chainId ---> : ${chainId}`);
    if (symbol === 'ETH' && baseSymbol === 'USDT')
        return 2000;
    if (symbol === 'ETH' && baseSymbol === 'ETH')
        return 1;
    throw Error('No test price, this should not happen');
}
function getETHisETHPrice() {
    return 1;
}
function getPairFromAddresses(addresses, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sdk = new sdk_1.default(chainId);
        const tokensPromises = addresses.map((address) => __awaiter(this, void 0, void 0, function* () { return yield getTokenFromAddress(address, chainId); }));
        const tokens = yield Promise.all(tokensPromises);
        const pair = yield sdk.getPair(tokens[0], tokens[1], getProvider(getNetworkFromChainId(chainId)), chainId);
        return pair;
    });
}
exports.getPairFromAddresses = getPairFromAddresses;
function getPairFromSymbols(symbol, baseSymbol, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sdk = new sdk_1.default(chainId);
        console.log(`symbol ---> : ${symbol}`);
        console.log(`baseSymbol ---> : ${baseSymbol}`);
        console.log(`chainId ---> : ${chainId}`);
        if (isETHisETH(symbol, baseSymbol))
            return getETHisETHPrice();
        // if (isTestPrice(symbol, baseSymbol))
        //   return getTestPrice(symbol, baseSymbol, chainId)
        const token = yield sdk.getSwapToken(getTokenFromList(symbol, chainId));
        if (!token)
            throw Error(`Symbol ${symbol} not found in our token list`);
        const baseToken = yield sdk.getSwapToken(getTokenFromList(baseSymbol, chainId));
        if (!baseToken)
            throw Error(`BaseSymbol ${baseSymbol} not found in our token list`);
        if (token.address === baseToken.address)
            return 1;
        console.log(`getNetworkFromChainId(chainId) ---> : ${getNetworkFromChainId(chainId)}`);
        return yield sdk.getPair(token, baseToken, getProvider(getNetworkFromChainId(chainId)), chainId);
    });
}
exports.getPairFromSymbols = getPairFromSymbols;
function getTokenPrice(symbol, baseSymbol, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sdk = new sdk_1.default(chainId);
            const pair = getPairFromSymbols(symbol, baseSymbol, chainId);
            const token = yield sdk.getSwapToken(getTokenFromList(symbol, chainId));
            if (!token)
                throw Error(`Symbol ${symbol} not found in our token list`);
            return sdk.getPrice(pair, token, chainId);
        }
        catch (error) {
            console.error(error);
            throw new Error(error);
        }
    });
}
exports.getTokenPrice = getTokenPrice;
function convertPriceUsdToEth(priceInUsd, timeStamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const priceEthUsdAtTime = yield getPriceAtTime('ETH', 'USDT', timeStamp, 1);
        const priceEth = priceInUsd / priceEthUsdAtTime;
        return priceEth;
    });
}
exports.convertPriceUsdToEth = convertPriceUsdToEth;
function convertPriceEthToUsd(priceInEth, timeStamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const priceEthUsdAtTime = yield getPriceAtTime('ETH', 'USDT', timeStamp, 1);
        const priceUsd = priceInEth * priceEthUsdAtTime;
        return priceUsd;
    });
}
exports.convertPriceEthToUsd = convertPriceEthToUsd;
/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
function getTokenExecutionPriceFromAddress(address, baseSymbol, chainId, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sdk = new sdk_1.default(chainId);
            const token = yield getTokenFromAddress(address, chainId);
            if (!token)
                throw Error(`Can't find a token for address ${address} not found in our token list`);
            const baseToken = yield getTokenFromAddress(address, chainId);
            if (!baseToken)
                throw Error(`BaseSymbol ${baseSymbol} not found in our token list`);
            if (token.address === baseToken.address)
                return 1;
            const provider = getProvider(getNetworkFromChainId(chainId));
            const pair = yield sdk.getPair(token, baseToken, provider, chainId);
            const price = sdk.getExecutionPrice(pair, baseToken, amount); // NO await?
            return price;
            // return sdk.getPrice(pair, token, chainId)
        }
        catch (error) {
            console.error(error);
            throw new Error(error);
        }
    });
}
exports.getTokenExecutionPriceFromAddress = getTokenExecutionPriceFromAddress;
function getPriceAtTime(from, to, timestamp, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sdk = new sdk_1.default(chainId);
        const pair = yield getPairFromSymbols(from, to, chainId);
        if (!pair)
            throw new Error(`No pair found from ${from} to ${to} and chainID ${chainId}`);
        console.log(`pair : ${JSON.stringify(pair, null, 2)}`);
        console.log(`pair.address ---> : ${pair.liquidityToken.address}`);
        console.log(`timestamp ---> : ${timestamp}`);
        console.log(`chainId ---> : ${chainId}`);
        const swap = yield theGraph_1.fetchSwapForPair(pair.liquidityToken.address.toLowerCase(), Math.round(timestamp), chainId);
        console.log(`swap§ ---> : ${swap}`);
        const price = price_1.getPriceFromSwap(swap, to);
        // const action = getActionFromSwap(swap, to)
        // let action: string = ''
        // let price: number = 0
        // if (Number(swap.amount0In) > 0) {
        //   action = 'buyEth ' + Number(swap.amount0In)
        //   price = Number(swap.amount0In) / Number(swap.amount1Out)
        // } else if (Number(swap.amount0Out) > 0) {
        //   action = 'sellEth ' + Number(swap.amount0Out)
        //   price = Number(swap.amount0Out) / Number(swap.amount1In)
        // } else {
        //   throw new Error('Should not happen')
        // }
        return price;
    });
}
exports.getPriceAtTime = getPriceAtTime;
function getTokenFromAddress(address, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sdk = new sdk_1.default(chainId);
        //const tokenFromList = getTokenFromList(symbol, chainId)
        const tokenFromList = tokenLists_1.allTokens.find(o => o.address.toLowerCase() === address.toLowerCase() && o.chainId === chainId);
        //console.log(`tokenFromList : ${JSON.stringify(tokenFromList, null, 2)}`)
        let token;
        if (tokenFromList) {
            token = yield sdk.getSwapToken(tokenFromList);
        }
        else {
            console.error(`WARNING unknown address ${address}`);
            token = yield sdk.createToken(1, address, 'DUNNO', 'dont know', 18);
        }
        return token;
    });
}
//# sourceMappingURL=index.js.map