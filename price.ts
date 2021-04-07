type token = {
  symbol: string
}
type pair = {
  token0: token
  token1: token
}
type swap = {
  amount0In: string
  amount0Out: string
  amount1In: string
  amount1Out: string
  amountUSD: string
  pair: pair
  to: string
}

/**
 *
 * @param swap
 * @param base return price in? ETH ? USD?
 * @returns
 */
export function getPriceFromSwap (swap: swap, baseSymbol: string) {
  const baseToken = swap.pair.token0.symbol === baseSymbol ? 0 : 1

  let price = 0
  if (Number(swap.amount0In) > 0) {
    if (baseToken === 0) {
      price = Number(swap.amount0In) / Number(swap.amount1Out)
    } else {
      price = Number(swap.amount1Out) / Number(swap.amount0In)
    }
  } else if (Number(swap.amount0Out) > 0) {
    if (baseToken === 0) {
      price = Number(swap.amount0Out) / Number(swap.amount1In)
    } else {
      price = Number(swap.amount1In) / Number(swap.amount0Out)
    }
  } else {
    throw new Error(`Invalid price from swap ${JSON.stringify(swap)}`)
  }
  return price
}

export function getActionFromSwap (swap: swap, subject: string) {
  const baseToken = swap.pair.token0.symbol === subject ? 0 : 1
  let action = ''
  if (Number(swap.amount0In) > 0) {
    if (baseToken == 1) {
      action = 'buy ' + subject + ' ' + Number(swap.amount1Out)
    } else {
      action = 'sell ' + subject + ' ' + Number(swap.amount0In)
    }
  } else if (Number(swap.amount0Out) > 0) {
    if (baseToken == 1) {
      action = 'sell ' + subject + ' ' + Number(swap.amount1In)
    } else {
      action = 'buy ' + subject + ' ' + Number(swap.amount0Out)
    }
  } else {
    throw new Error(`Invalid action from swap ${JSON.stringify(swap)}`)
  }
  return action
}
