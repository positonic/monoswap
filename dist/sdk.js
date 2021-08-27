"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UniSdk = __importStar(require("@uniswap/sdk"));
const HoneySdk = __importStar(require("honeyswap-sdk"));
const PancakeSdk = __importStar(require("@pancakeswap-libs/sdk"));
function isMainNet(chainId) {
    return chainId === 1;
}
function isXDai(chainId) {
    return chainId === 100;
}
function isRopsten(chainId) {
    return chainId === 3;
}
class Sdk {
    constructor(chainId) {
        this.chainId = chainId;
        this.chainId = chainId;
        this.getSwapSdk(chainId);
    }
    getSwapSdk(chainId) {
        if (isMainNet(chainId)) {
            this.sdk = UniSdk;
        }
        else if (chainId === 3) {
            this.sdk = UniSdk;
        }
        else if (isXDai(chainId)) {
            this.sdk = HoneySdk;
        }
        else if (chainId === 56) {
            console.log(`GOINFOR 56`);
            this.sdk = PancakeSdk;
        }
        else {
            throw new Error(`${chainId} is unsupported`);
        }
    }
    createToken(chainId, address, symbol, name, decimals) {
        console.log(`{chainId, address, decimals, symbol, name} : ${JSON.stringify({ chainId, address, decimals, symbol, name }, null, 2)}`);
        return new this.sdk.Token(chainId, address, decimals, symbol, name);
    }
    getSwapToken(token) {
        if (!token)
            throw new Error('Cannot swap a nothing');
        const { chainId, address, decimals, symbol, name } = token;
        if (!this.sdk)
            throw new Error('Sdk not initialised in constructor');
        const { Token } = this.sdk;
        return new Token(chainId, address, decimals, symbol, name);
    }
    getPrice(pair, token, chainId) {
        const { Route } = this.sdk;
        const route = new Route([pair], token);
        const price = route.midPrice.toSignificant(6);
        // console.log('JIS inv', route.midPrice.invert().toSignificant(6)) // 0.00496756
        // console.log('price', price) // 201.306
        return Number(price);
    }
    getExecutionPrice(pair, token, amount) {
        console.log('getExecutionPrice');
        const { Route, Trade, WETH, TokenAmount, TradeType } = this.sdk;
        const route = new Route([pair], token);
        // const price = route.midPrice.toSignificant(6)
        // console.log(`route : ${JSON.stringify(route, null, 2)}`)
        // console.log(`this.chainId ---> : ${this.chainId}`)
        // console.log(`amount ---> : ${amount}`)
        // console.log(`typeof amount ---> : ${typeof amount}`)
        // console.log(
        //   `AMOUNT : ${JSON.stringify(
        //     new TokenAmount(token, amount.toString()),
        //     null,
        //     2
        //   )}`
        // )
        const trade = new Trade(route, new TokenAmount(token, amount.toString()), TradeType.EXACT_INPUT);
        console.log(`trade : ${JSON.stringify(trade, null, 2)}`);
        console.log(`trade : ${JSON.stringify(trade.executionPrice.toSignificant(6), null, 2)}`);
        console.log(`trade.nextMidPrice.toSignificant(6) : ${JSON.stringify(trade.nextMidPrice.toSignificant(6), null, 2)}`);
        return trade;
    }
    getPair(token0, token1, provider, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Fetcher } = this.sdk;
            const pair = yield Fetcher.fetchPairData(token0, token1, provider);
            return pair;
        });
    }
}
exports.default = Sdk;
//# sourceMappingURL=sdk.js.map