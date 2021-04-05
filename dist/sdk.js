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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var UniSdk = __importStar(require("@uniswap/sdk"));
var HoneySdk = __importStar(require("honeyswap-sdk"));
function isMainNet(chainId) {
    return chainId === 1;
}
function isXDai(chainId) {
    return chainId === 100;
}
function isRopsten(chainId) {
    return chainId === 3;
}
var Sdk = /** @class */ (function () {
    function Sdk(chainId) {
        this.chainId = chainId;
        this.chainId = chainId;
        this.getSwapSdk(chainId);
    }
    Sdk.prototype.getSwapSdk = function (chainId) {
        if (isMainNet(chainId)) {
            this.sdk = UniSdk;
        }
        else if (isXDai(chainId)) {
            this.sdk = HoneySdk;
        }
        else {
            throw new Error(chainId + " is unsupported");
        }
    };
    Sdk.prototype.createToken = function (chainId, address, symbol, name, decimals) {
        console.log("{chainId, address, decimals, symbol, name} : " + JSON.stringify({ chainId: chainId, address: address, decimals: decimals, symbol: symbol, name: name }, null, 2));
        return new this.sdk.Token(chainId, address, decimals, symbol, name);
    };
    Sdk.prototype.getSwapToken = function (token) {
        if (!token)
            throw new Error('Cannot swap a nothing');
        var chainId = token.chainId, address = token.address, decimals = token.decimals, symbol = token.symbol, name = token.name;
        if (!this.sdk)
            throw new Error('Sdk not initialised in constructor');
        var Token = this.sdk.Token;
        return new Token(chainId, address, decimals, symbol, name);
    };
    Sdk.prototype.getPrice = function (pair, token, chainId) {
        var Route = this.sdk.Route;
        var route = new Route([pair], token);
        var price = route.midPrice.toSignificant(6);
        console.log('JIS inv', route.midPrice.invert().toSignificant(6)); // 0.00496756
        console.log('price', price); // 201.306
        return Number(price);
    };
    Sdk.prototype.getExecutionPrice = function (pair, token, amount) {
        console.log('getExecutionPrice');
        var _a = this.sdk, Route = _a.Route, Trade = _a.Trade, WETH = _a.WETH, TokenAmount = _a.TokenAmount, TradeType = _a.TradeType;
        var route = new Route([pair], token);
        // const price = route.midPrice.toSignificant(6)
        console.log("route : " + JSON.stringify(route, null, 2));
        console.log("this.chainId ---> : " + this.chainId);
        console.log("amount ---> : " + amount);
        console.log("typeof amount ---> : " + typeof amount);
        console.log("AMOUNT : " + JSON.stringify(new TokenAmount(token, amount.toString()), null, 2));
        var trade = new Trade(route, new TokenAmount(token, amount.toString()), TradeType.EXACT_INPUT);
        console.log("trade : " + JSON.stringify(trade, null, 2));
        console.log("trade : " + JSON.stringify(trade.executionPrice.toSignificant(6), null, 2));
        console.log("trade.nextMidPrice.toSignificant(6) : " + JSON.stringify(trade.nextMidPrice.toSignificant(6), null, 2));
        return trade;
    };
    Sdk.prototype.getPair = function (token0, token1, provider, chainId) {
        return __awaiter(this, void 0, void 0, function () {
            var Fetcher, pair;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Fetcher = this.sdk.Fetcher;
                        return [4 /*yield*/, Fetcher.fetchPairData(token0, token1, provider)];
                    case 1:
                        pair = _a.sent();
                        return [2 /*return*/, pair];
                }
            });
        });
    };
    return Sdk;
}());
exports["default"] = Sdk;
//# sourceMappingURL=sdk.js.map