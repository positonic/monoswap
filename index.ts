import Sdk from './sdk'
import * as ethers from 'ethers'
import config from './config'
import { allTokens } from './tokenLists'
import { pairs } from './pairLists'
import { fetchSwapForPair } from './theGraph'
import { getPriceFromSwap, getActionFromSwap } from './price'

const INFURA_ID = config.get('ETHEREUM_NODE_ID')

export function getProvider (network) {
  if (network === 'xdaiChain') {
    return new ethers.providers.JsonRpcProvider(
      config.get('XDAI_NODE_HTTP_URL').toString()
    )
  }
  return new ethers.providers.InfuraProvider(network, INFURA_ID)
}

export function getNetworkFromChainId (chainId: number) {
  if (chainId === 1) {
    return 'mainnet'
  } else if (chainId === 100) {
    return 'xdaiChain'
  } else if (chainId === 3) {
    return 'ropstem'
  } else if (chainId === 56) {
    return 'bsc'
  } else {
    throw new Error('Invalid chainId')
  }
}

export function getOurTokenList () {
  return allTokens
}

export async function getTokenPrices (
  symbol: string,
  baseSymbols: string[],
  chainId: number
) {
  return new Promise((resolve: (prices: number[]) => void, reject) => {
    const pricePromises = baseSymbols.map(base =>
      getTokenPrice(symbol, base, chainId)
    )
    Promise.all(pricePromises)
      .then((prices: number[]) => {
        resolve(prices)
      })
      .catch(reject)
  })
}

export async function getTokenPricesFromAddress (
  address: string,
  baseSymbols: string[],
  chainId: number
) {
  return new Promise((resolve: (prices: number[]) => void, reject) => {
    const pricePromises = baseSymbols.map(base =>
      getTokenPriceFromAddress(address, base, chainId)
    )
    Promise.all(pricePromises)
      .then((prices: number[]) => {
        resolve(prices)
      })
      .catch(reject)
  })
}
/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
export async function getTokenPriceFromAddress (
  address: string,
  baseSymbol: string,
  chainId: number,
  symbol: string = 'Dunno'
) {
  try {
    const sdk = new Sdk(chainId)
    const token = await getTokenFromAddress(address, chainId)

    const baseTokenFromList = await getTokenFromList(baseSymbol, chainId)
    //const baseToken = await getTokenFromAddress(address, chainId)
    const baseToken = await sdk.getSwapToken(baseTokenFromList)
    if (!baseToken)
      throw Error(`BaseSymbol ${baseSymbol} not found in our token list`)

    if (address === baseToken.address) return 1
    const provider = getProvider(getNetworkFromChainId(chainId))

    const pair = await sdk.getPair(token, baseToken, provider, chainId)

    return await sdk.getPrice(pair, token, chainId)
  } catch (error) {
    console.log(
      `Warning, no price for:  ---> : ${address}, ${baseSymbol} - ${chainId}`
    )

    // There may be no pair so return 0
    // console.error(error)
    // throw new Error(error)
  }
}

/**
 * Get Token details
 */
export function getTokenFromList (symbol: string, chainId: number) {
  const inSymbol =
    symbol.toUpperCase() === 'ETH' ? 'WETH' : symbol.toUpperCase()

  const token = allTokens.find(
    o => o.symbol === inSymbol && o.chainId === chainId
  )

  if (!token)
    throw new Error(`Token ${inSymbol} not found for chainId ${chainId}`)
  return token
}

function isTestPrice (symbol, baseSymbol) {
  return (
    (symbol === 'ETH' && baseSymbol === 'USDT') ||
    (symbol === 'ETH' && baseSymbol === 'ETH')
  )
}
function isETHisETH (symbol, baseSymbol) {
  return symbol === 'ETH' && baseSymbol === 'ETH'
}
function getTestPrice (symbol, baseSymbol, chainId) {
  if (symbol === 'ETH' && baseSymbol === 'USDT') return 2000
  if (symbol === 'ETH' && baseSymbol === 'ETH') return 1
  throw Error('No test price, this should not happen')
}
function getETHisETHPrice () {
  return 1
}

export async function getPairFromAddresses (
  addresses: string[],
  chainId: number
) {
  const sdk = new Sdk(chainId)
  const tokensPromises = addresses.map(
    async address => await getTokenFromAddress(address, chainId)
  )

  const tokens = await Promise.all(tokensPromises)

  const pair = await sdk.getPair(
    tokens[0],
    tokens[1],
    getProvider(getNetworkFromChainId(chainId)),
    chainId
  )

  return pair
}

export async function getPairFromSymbols (
  symbol: string,
  baseSymbol: string,
  chainId: number
) {
  const sdk = new Sdk(chainId)

  const token = await sdk.getSwapToken(getTokenFromList(symbol, chainId))

  if (!token) throw Error(`Symbol ${symbol} not found in our token list`)

  const baseToken = await sdk.getSwapToken(
    getTokenFromList(baseSymbol, chainId)
  )
  if (!baseToken)
    throw Error(`BaseSymbol ${baseSymbol} not found in our token list`)

  if (token.address === baseToken.address) return 1

  try {
    const pair = await sdk.getPair(
      token,
      baseToken,
      getProvider(getNetworkFromChainId(chainId)),
      chainId
    )
    return pair
  } catch (e) {
    return null
  }
}

export async function getTokenPriceFromSdk (pair, token, chainId: number) {
  try {
    const sdk = new Sdk(chainId)
    return sdk.getPrice(pair, token, chainId)
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export async function getTokenPriceFromEthPrice (
  fromSymbol: string,
  toSymbol: string,
  chainId: number,
  timestamp: number
) {
  const sdk = new Sdk(chainId)
  let pair
  const token = await sdk.getSwapToken(getTokenFromList(fromSymbol, chainId))
  try {
    pair = await getPairFromSymbols(fromSymbol, 'ETH', chainId)
    const ethPerToken = await getTokenPriceFromSdk(pair, token, chainId)

    if (toSymbol === 'USD' || toSymbol === 'USDT' || toSymbol === 'USDC') {
      const usdPerToken = await convertPriceEthToUsd(ethPerToken, timestamp)

      return usdPerToken
    } else {
      throw new Error(
        `Can't convert symbol ${fromSymbol} to base symbol ${toSymbol}`
      )
    }
  } catch (e) {
    throw new Error(
      ` getTokenPriceFromEthPrice can't convert symbol ${fromSymbol} to ${toSymbol} sdkPairs is ${pair}`
    )
  }
}
export async function getTokenPrice (
  symbol: string,
  baseSymbol: string,
  chainId: number
) {
  try {
    if (isETHisETH(symbol, baseSymbol)) return getETHisETHPrice()

    const sdk = new Sdk(chainId)

    const pair = await getPairFromSymbols(symbol, baseSymbol, chainId)

    if (pair) {
      const token = await sdk.getSwapToken(getTokenFromList(symbol, chainId))
      return getTokenPriceFromSdk(pair, token, chainId)
    } else {
      const nowStamp = Date.now()
      const price = getTokenPriceFromEthPrice(
        symbol,
        baseSymbol,
        chainId,
        nowStamp
      )
      return price
    }
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export async function convertPriceUsdToEth (priceInUsd, timeStamp) {
  const priceEthUsdAtTime: number = await getPriceAtTime(
    'ETH',
    'USDT',
    timeStamp,
    1
  )
  const usdPerEth = 1 / priceEthUsdAtTime

  const priceEth = priceInUsd / usdPerEth

  return priceEth
}

export async function convertPriceEthToUsd (priceInEth, timeStamp) {
  const priceEthUsdAtTime: number = await getPriceAtTime(
    'ETH',
    'USDT',
    timeStamp,
    1
  )

  const usdPerEth = 1 / priceEthUsdAtTime
  const priceEth = priceInEth * usdPerEth

  return priceEth
}

/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
export async function getTokenExecutionPriceFromAddress (
  address: string,
  baseSymbol: string,
  chainId: number,
  amount: number
) {
  try {
    const sdk = new Sdk(chainId)
    const token = await getTokenFromAddress(address, chainId)
    if (!token)
      throw Error(
        `Can't find a token for address ${address} not found in our token list`
      )

    const baseToken = await getTokenFromAddress(address, chainId)
    if (!baseToken)
      throw Error(`BaseSymbol ${baseSymbol} not found in our token list`)

    if (token.address === baseToken.address) return 1
    const provider = getProvider(getNetworkFromChainId(chainId))
    const pair = await sdk.getPair(token, baseToken, provider, chainId)
    const price = sdk.getExecutionPrice(pair, baseToken, amount) // NO await?

    return price
    // return sdk.getPrice(pair, token, chainId)
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}

export async function getPriceAtTime (
  from: string,
  to: string,
  timestamp: number,
  chainId: number
) {
  const sdk = new Sdk(chainId)

  const pair = await getPairFromSymbols(from, to, chainId)

  if (!pair)
    throw new Error(
      `No pair found from ${from} to ${to} and chainID ${chainId}`
    )

  const quoteToken = pair.tokenAmounts[0].token.symbol === from ? 'from' : 'to'

  ///console.log(`quoteToken ---> : ${quoteToken}`)
  // console.log(`pair : ${JSON.stringify(pair, null, 2)}`)

  // console.log(`pair.address ---> : ${pair.liquidityToken.address}`)
  // console.log(`timestamp ---> : ${timestamp}`)
  // console.log(`chainId ---> : ${chainId}`)
  const swap = await fetchSwapForPair(
    pair.liquidityToken.address.toLowerCase(),
    Math.round(timestamp),
    chainId
  )

  const price = getPriceFromSwap(swap, to)
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

  return quoteToken === 'from' ? price : 1 / price
}

async function getTokenFromAddress (address: string, chainId: number) {
  const sdk = new Sdk(chainId)
  //const tokenFromList = getTokenFromList(symbol, chainId)
  const tokenFromList = allTokens.find(
    o =>
      o.address.toLowerCase() === address.toLowerCase() && o.chainId === chainId
  )
  //console.log(`tokenFromList : ${JSON.stringify(tokenFromList, null, 2)}`)

  let token
  if (tokenFromList) {
    token = await sdk.getSwapToken(tokenFromList)
  } else {
    console.error(`WARNING unknown address ${address}`)
    token = await sdk.createToken(1, address, 'DUNNO', 'dont know', 18)
  }

  return token
}

/**
 *
 * @param symbol 'MKR'
 * @param baseSymbol 'USDT'
 * @param chainId 1
 * @returns
 */
export async function getTokenExecutionPrice (
  symbol: string,
  baseSymbol: string,
  chainId: number,
  amount: number
) {
  try {
    const sdk = new Sdk(chainId)
    const token = await sdk.getSwapToken(getTokenFromList(symbol, chainId))

    if (!token) throw Error(`Symbol ${symbol} not found in our token list`)

    const baseToken = await sdk.getSwapToken(
      getTokenFromList(baseSymbol, chainId)
    )
    if (!baseToken)
      throw Error(`BaseSymbol ${baseSymbol} not found in our token list`)

    if (token.address === baseToken.address) return 1
    const provider = getProvider(getNetworkFromChainId(chainId))
    const pair = await sdk.getPair(token, baseToken, provider, chainId)
    const price = sdk.getExecutionPrice(pair, baseToken, amount) // NO await?

    //console.log(`xprice : ${JSON.stringify(price, null, 2)}`)

    return price
    // return sdk.getPrice(pair, token, chainId)
  } catch (error) {
    console.error(error)
    throw new Error(error)
  }
}
