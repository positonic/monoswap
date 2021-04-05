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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var sdk_1 = __importDefault(require("./sdk"));
var ethers_1 = __importDefault(require("ethers"));
var config_1 = __importDefault(require("./config"));
var tokenLists_1 = require("./tokenLists");
var theGraph_1 = require("./theGraph");
var price_1 = require("./price");
var INFURA_ID = config_1["default"].get('ETHEREUM_NODE_ID');
function getProvider(network) {
    if (network === 'xdaiChain') {
        console.log("config.get('XDAI_NODE_HTTP_URL') ---> : " + config_1["default"].get('XDAI_NODE_HTTP_URL'));
        return new ethers_1["default"].providers.JsonRpcProvider(config_1["default"].get('XDAI_NODE_HTTP_URL').toString());
    }
    return new ethers_1["default"].providers.InfuraProvider(network, INFURA_ID);
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
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var pricePromises = baseSymbols.map(function (base) {
                        return getTokenPrice(symbol, base, chainId);
                    });
                    Promise.all(pricePromises)
                        .then(function (prices) {
                        resolve(prices);
                    })["catch"](reject);
                })];
        });
    });
}
exports.getTokenPrices = getTokenPrices;
/**
 * Get Token details
 */
function getTokenFromList(symbol, chainId) {
    var inSymbol = symbol.toUpperCase() === 'ETH' ? 'WETH' : symbol.toUpperCase();
    var token = tokenLists_1.allTokens.find(function (o) { return o.symbol === inSymbol && o.chainId === chainId; });
    if (!token)
        throw new Error("Token " + inSymbol + " not found");
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
    console.log("symbol ---> : " + symbol);
    console.log("baseSymbol ---> : " + baseSymbol);
    console.log("chainId ---> : " + chainId);
    if (symbol === 'ETH' && baseSymbol === 'USDT')
        return 2000;
    if (symbol === 'ETH' && baseSymbol === 'ETH')
        return 1;
    throw Error('No test price, this should not happen');
}
function getETHisETHPrice() {
    return 1;
}
function getPairFromSymbols(symbol, baseSymbol, chainId) {
    return __awaiter(this, void 0, void 0, function () {
        var sdk, token, baseToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sdk = new sdk_1["default"](chainId);
                    console.log("symbol ---> : " + symbol);
                    console.log("baseSymbol ---> : " + baseSymbol);
                    console.log("chainId ---> : " + chainId);
                    if (isETHisETH(symbol, baseSymbol))
                        return [2 /*return*/, getETHisETHPrice()
                            // if (isTestPrice(symbol, baseSymbol))
                            //   return getTestPrice(symbol, baseSymbol, chainId)
                        ];
                    return [4 /*yield*/, sdk.getSwapToken(getTokenFromList(symbol, chainId))];
                case 1:
                    token = _a.sent();
                    if (!token)
                        throw Error("Symbol " + symbol + " not found in our token list");
                    return [4 /*yield*/, sdk.getSwapToken(getTokenFromList(baseSymbol, chainId))];
                case 2:
                    baseToken = _a.sent();
                    if (!baseToken)
                        throw Error("BaseSymbol " + baseSymbol + " not found in our token list");
                    if (token.address === baseToken.address)
                        return [2 /*return*/, 1];
                    console.log("getNetworkFromChainId(chainId) ---> : " + getNetworkFromChainId(chainId));
                    return [4 /*yield*/, sdk.getPair(token, baseToken, getProvider(getNetworkFromChainId(chainId)), chainId)];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getPairFromSymbols = getPairFromSymbols;
function getTokenPrice(symbol, baseSymbol, chainId) {
    return __awaiter(this, void 0, void 0, function () {
        var sdk, pair, token, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    sdk = new sdk_1["default"](chainId);
                    pair = getPairFromSymbols(symbol, baseSymbol, chainId);
                    return [4 /*yield*/, sdk.getSwapToken(getTokenFromList(symbol, chainId))];
                case 1:
                    token = _a.sent();
                    if (!token)
                        throw Error("Symbol " + symbol + " not found in our token list");
                    return [2 /*return*/, sdk.getPrice(pair, token, chainId)];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    throw new Error(error_1);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getTokenPrice = getTokenPrice;
function convertPriceUsdToEth(priceInUsd, timeStamp) {
    return __awaiter(this, void 0, void 0, function () {
        var priceEthUsdAtTime, priceEth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPriceAtTime('ETH', 'USDT', timeStamp, 1)];
                case 1:
                    priceEthUsdAtTime = _a.sent();
                    priceEth = priceInUsd / priceEthUsdAtTime;
                    return [2 /*return*/, priceEth];
            }
        });
    });
}
exports.convertPriceUsdToEth = convertPriceUsdToEth;
function convertPriceEthToUsd(priceInEth, timeStamp) {
    return __awaiter(this, void 0, void 0, function () {
        var priceEthUsdAtTime, priceUsd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPriceAtTime('ETH', 'USDT', timeStamp, 1)];
                case 1:
                    priceEthUsdAtTime = _a.sent();
                    priceUsd = priceInEth * priceEthUsdAtTime;
                    return [2 /*return*/, priceUsd];
            }
        });
    });
}
exports.convertPriceEthToUsd = convertPriceEthToUsd;
function getPriceAtTime(from, to, timestamp, chainId) {
    return __awaiter(this, void 0, void 0, function () {
        var sdk, pair, swap, price;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sdk = new sdk_1["default"](chainId);
                    return [4 /*yield*/, getPairFromSymbols(from, to, chainId)];
                case 1:
                    pair = _a.sent();
                    if (!pair)
                        throw new Error("No pair found from " + from + " to " + to + " and chainID " + chainId);
                    console.log("pair : " + JSON.stringify(pair, null, 2));
                    console.log("pair.address ---> : " + pair.liquidityToken.address);
                    console.log("timestamp ---> : " + timestamp);
                    console.log("chainId ---> : " + chainId);
                    return [4 /*yield*/, theGraph_1.fetchSwapForPair(pair.liquidityToken.address.toLowerCase(), Math.round(timestamp), chainId)];
                case 2:
                    swap = _a.sent();
                    console.log("swap\u00A7 ---> : " + swap);
                    price = price_1.getPriceFromSwap(swap, to);
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
                    return [2 /*return*/, price];
            }
        });
    });
}
exports.getPriceAtTime = getPriceAtTime;
//# sourceMappingURL=index.js.map