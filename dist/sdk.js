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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const UniSdk = __importStar(require("@uniswap/sdk"));
const HoneySdk = __importStar(require("honeyswap-sdk"));
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
        else if (isXDai(chainId)) {
            this.sdk = HoneySdk;
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
        console.log('JIS inv', route.midPrice.invert().toSignificant(6)); // 0.00496756
        console.log('price', price); // 201.306
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