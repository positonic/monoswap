import Sdk from './sdk'
import ethers from 'ethers'
import config from './config'
import { allTokens } from './tokenLists'
import { pairs } from './pairLists'
import { fetchSwapForPair } from './theGraph'
import { getPriceFromSwap, getActionFromSwap } from './price'

const INFURA_ID = config.get('ETHEREUM_NODE_ID')

function getProvider (network) {
  if (network === 'xdaiChain') {
    console.log(
      `config.get('XDAI_NODE_HTTP_URL') ---> : ${config.get(
        'XDAI_NODE_HTTP_URL'
      )}`
    )
    return new ethers.providers.JsonRpcProvider(
      config.get('XDAI_NODE_HTTP_URL').toString()
    )
  }
  return new ethers.providers.InfuraProvider(network, INFURA_ID)
}

function getNetworkFromChainId (chainId) {
  if (chainId === 1) {
    return 'mainnet'
  } else if (chainId === 100) {
    return 'xdaiChain'
  } else if (chainId === 3) {
    return 'ropstem'
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

/**
 * Get Token details
 */
export function getTokenFromList (symbol: string, chainId: number) {
  const inSymbol =
    symbol.toUpperCase() === 'ETH' ? 'WETH' : symbol.toUpperCase()

  const token = allTokens.find(
    o => o.symbol === inSymbol && o.chainId === chainId
  )

  if (!token) throw new Error(`Token ${inSymbol} not found`)
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
  console.log(`symbol ---> : ${symbol}`)
  console.log(`baseSymbol ---> : ${baseSymbol}`)
  console.log(`chainId ---> : ${chainId}`)
  if (symbol === 'ETH' && baseSymbol === 'USDT') return 2000
  if (symbol === 'ETH' && baseSymbol === 'ETH') return 1
  throw Error('No test price, this should not happen')
}
function getETHisETHPrice () {
  return 1
}

export async function getPairFromSymbols (
  symbol: string,
  baseSymbol: string,
  chainId: number
) {
  const sdk = new Sdk(chainId)

  console.log(`symbol ---> : ${symbol}`)
  console.log(`baseSymbol ---> : ${baseSymbol}`)
  console.log(`chainId ---> : ${chainId}`)
  if (isETHisETH(symbol, baseSymbol)) return getETHisETHPrice()
  // if (isTestPrice(symbol, baseSymbol))
  //   return getTestPrice(symbol, baseSymbol, chainId)

  const token = await sdk.getSwapToken(getTokenFromList(symbol, chainId))

  if (!token) throw Error(`Symbol ${symbol} not found in our token list`)

  const baseToken = await sdk.getSwapToken(
    getTokenFromList(baseSymbol, chainId)
  )
  if (!baseToken)
    throw Error(`BaseSymbol ${baseSymbol} not found in our token list`)

  if (token.address === baseToken.address) return 1

  console.log(
    `getNetworkFromChainId(chainId) ---> : ${getNetworkFromChainId(chainId)}`
  )
  return await sdk.getPair(
    token,
    baseToken,
    getProvider(getNetworkFromChainId(chainId)),
    chainId
  )
}

export async function getTokenPrice (
  symbol: string,
  baseSymbol: string,
  chainId: number
) {
  try {
    const sdk = new Sdk(chainId)

    const pair = getPairFromSymbols(symbol, baseSymbol, chainId)

    const token = await sdk.getSwapToken(getTokenFromList(symbol, chainId))

    if (!token) throw Error(`Symbol ${symbol} not found in our token list`)
    return sdk.getPrice(pair, token, chainId)
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

  const priceEth = priceInUsd / priceEthUsdAtTime

  return priceEth
}

export async function convertPriceEthToUsd (priceInEth, timeStamp) {
  const priceEthUsdAtTime: number = await getPriceAtTime(
    'ETH',
    'USDT',
    timeStamp,
    1
  )

  const priceUsd = priceInEth * priceEthUsdAtTime

  return priceUsd
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

  console.log(`pair : ${JSON.stringify(pair, null, 2)}`)

  console.log(`pair.address ---> : ${pair.liquidityToken.address}`)
  console.log(`timestamp ---> : ${timestamp}`)
  console.log(`chainId ---> : ${chainId}`)
  const swap = await fetchSwapForPair(
    pair.liquidityToken.address.toLowerCase(),
    Math.round(timestamp),
    chainId
  )

  console.log(`swap§ ---> : ${swap}`)

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

  return price
}
