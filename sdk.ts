import * as UniSdk from '@uniswap/sdk'
import * as HoneySdk from 'honeyswap-sdk'
import * as PancakeSdk from '@pancakeswap-libs/sdk'

interface token {
  chainId: number
  address: string
  symbol: string
  name: string
  decimals: number
}

function isMainNet (chainId) {
  return chainId === 1
}
function isXDai (chainId) {
  return chainId === 100
}
function isRopsten (chainId) {
  return chainId === 3
}

type SwapToken = {
  decimals: number
  symbol: string
  name: string
  chainId: number
  address: string
}

export default class Sdk {
  sdk: { Token; Route; Pair; Fetcher; Trade; WETH; TokenAmount; TradeType }

  constructor (public chainId: number) {
    this.chainId = chainId
    this.getSwapSdk(chainId)
  }

  getSwapSdk (chainId) {
    if (isMainNet(chainId)) {
      this.sdk = UniSdk
    } else if (chainId === 3) {
      this.sdk = UniSdk
    } else if (isXDai(chainId)) {
      this.sdk = HoneySdk
    } else if (chainId === 56) {
      console.log(`GOINFOR 56`)
      this.sdk = PancakeSdk
    } else {
      throw new Error(`${chainId} is unsupported`)
    }
  }

  createToken (chainId, address, symbol, name, decimals) {
    console.log(
      `{chainId, address, decimals, symbol, name} : ${JSON.stringify(
        { chainId, address, decimals, symbol, name },
        null,
        2
      )}`
    )

    return new this.sdk.Token(chainId, address, decimals, symbol, name)
  }

  getSwapToken (token: token) {
    if (!token) throw new Error('Cannot swap a nothing')
    const { chainId, address, decimals, symbol, name } = token

    if (!this.sdk) throw new Error('Sdk not initialised in constructor')
    const { Token } = this.sdk
    return new Token(chainId, address, decimals, symbol, name)
  }

  getPrice (pair, token, chainId) {
    const { Route } = this.sdk

    const route = new Route([pair], token)
    const price = route.midPrice.toSignificant(6)

    // console.log('JIS inv', route.midPrice.invert().toSignificant(6)) // 0.00496756
    // console.log('price', price) // 201.306

    return Number(price)
  }

  getExecutionPrice (pair, token: SwapToken, amount) {
    console.log('getExecutionPrice')

    const { Route, Trade, WETH, TokenAmount, TradeType } = this.sdk

    const route = new Route([pair], token)
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

    const trade = new Trade(
      route,
      new TokenAmount(token, amount.toString()),
      TradeType.EXACT_INPUT
    )
    console.log(`trade : ${JSON.stringify(trade, null, 2)}`)

    console.log(
      `trade : ${JSON.stringify(
        trade.executionPrice.toSignificant(6),
        null,
        2
      )}`
    )
    console.log(
      `trade.nextMidPrice.toSignificant(6) : ${JSON.stringify(
        trade.nextMidPrice.toSignificant(6),
        null,
        2
      )}`
    )

    return trade
  }

  async getPair (token0, token1, provider, chainId) {
    const { Fetcher } = this.sdk

    const pair = await Fetcher.fetchPairData(token0, token1, provider)

    return pair
  }
}
