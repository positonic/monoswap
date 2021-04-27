var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require('axios');
function fetchSwapForPair(pairId, timestamp, chainId) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
  query GetSwap {
    swaps(first: 1, orderBy: timestamp, orderDirection: desc, where:
      { pair: "${pairId}", timestamp_lt: "${timestamp}" }
     ) {
          pair {
            token0 {
              symbol
            }
            token1 {
              symbol
            }
          }
          amount0In
          amount0Out
          amount1In
          amount1Out
          amountUSD
          to
      }
  }
  `;
        console.log(`query ---> : ${query}`);
        let graphUrl = '';
        if (chainId === 1) {
            graphUrl = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
        }
        else if (chainId === 100) {
            graphUrl = 'https://api.thegraph.com/subgraphs/name/1hive/uniswap-v2';
        }
        else {
            throw new Error("unsupported chainId");
        }
        try {
            const response = yield axios({
                url: graphUrl,
                method: 'post',
                data: {
                    query
                }
            });
            //console.log(`response : ${JSON.stringify(response, null, 2)}`)
            return response.data.data.swaps[0];
        }
        catch (error) {
            console.error(error);
            throw new Error(`Error for pairId: ${pairId}, timestamp: ${timestamp}, chainId: ${chainId}`);
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetchSwapForPair("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", "1615588247");
        yield fetchSwapForPair("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc", "1615591976");
    });
}
// run()
module.exports = {
    fetchSwapForPair
};
//# sourceMappingURL=theGraph.js.map