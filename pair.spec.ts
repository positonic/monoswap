var assert = require('assert')
import { getPairFromSymbols } from './index'
import { getTokenPriceFromEthPrice } from './index'

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', async function () {
      // try {
      //   const pair = await getPairFromSymbols('PAN', 'USDT', 1)
      //   assert.equal(pair, 1)
      // } catch (e) {
      //   console.error('Pair doesnt exist')
      // }
      const nowStamp = Date.now()
      console.log(`nowStamp ---> : ${nowStamp}`)
      const priceUsd = await getTokenPriceFromEthPrice(
        'PAN',
        'USD',
        1,
        nowStamp
      )
      console.log(`priceUsd ---> : ${priceUsd}`)
    })
  })
})
