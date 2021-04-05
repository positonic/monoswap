var assert = require('assert')
import { getPriceFromSwap, getActionFromSwap } from './price'
import { convertPriceUsdToEth } from './index'

const swap = {
  amount0In: '0.001443376148615378',
  amount0Out: '0',
  amount1In: '0',
  amount1Out: '1.160004717158563101',
  amountUSD: '1.161748795750977198537238762154661',
  pair: {
    token0: {
      symbol: 'HNY'
    },
    token1: {
      symbol: 'WXDAI'
    }
  },
  to: '0x9a1eb049f2da6ec476d0fb31c3e772c31a640bb2'
}
const swap2 = {
  amount0In: '1',
  amount0Out: '0',
  amount1In: '0',
  amount1Out: '1000',
  amountUSD: '1000',
  pair: {
    token0: {
      symbol: 'HNY'
    },
    token1: {
      symbol: 'WXDAI'
    }
  },
  to: '0x9a1eb049f2da6ec476d0fb31c3e772c31a640bb2'
}
const swap3 = {
  amount0In: '0',
  amount0Out: '9997.83951',
  amount1In: '5.698234439226633965',
  amount1Out: '0',
  amountUSD: '10015.35916267681611239557349514548',
  pair: {
    token0: {
      symbol: 'USDC'
    },
    token1: {
      symbol: 'WETH'
    }
  },
  to: '0x609edf26c5b7caa76816fdcfeab72484dbfe88a7'
}

const swap4 = {
  amount0In: '0',
  amount0Out: '0.000496574542728254',
  amount1In: '0.409417852870756837',
  amount1Out: '0',
  amountUSD: '0.4088038684435373165013155071820357',
  pair: {
    token0: {
      symbol: 'HNY'
    },
    token1: {
      symbol: 'WXDAI'
    }
  },
  to: '0x93aee74bc31dd0df47b44a2659a8182c957f83c9'
}
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      const price = getPriceFromSwap(swap, 'WXDAI')
      assert.equal(price, 803.6745780172054)
      const action1 = getActionFromSwap(swap, 'WXDAI')
      assert.equal(action1, 'buy WXDAI 1.160004717158563')

      const price2 = getPriceFromSwap(swap2, 'WXDAI')
      const action2 = getActionFromSwap(swap2, 'HNY')
      assert.equal(price2, 1000)
      assert.equal(action2, 'sell HNY 1')

      const price3 = getPriceFromSwap(swap3, 'USDC')
      const action3 = getActionFromSwap(swap3, 'USDC')
      assert.equal(price3, 1754.5503991859116)
      assert.equal(action3, 'buy USDC 9997.83951')

      const price4 = getPriceFromSwap(swap4, 'USDC')
      assert.equal(price4, 824.4841763763293)
    })

    it('Tests converting Usd to Eth pricing', async () => {
      const price = await convertPriceUsdToEth(1000, 1616943939)

      assert.equal(price, 0.586979591467477)
    })
  })
})
