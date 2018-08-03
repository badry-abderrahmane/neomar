
const Binance = require('binance-api-node').default


module.exports = {

  init: function (config){
    const client = Binance({
      apiKey: config.pkey,
      apiSecret: config.skey,
      // apiKey: '9iYXsX3ymtHoZIJf1fMXIsqzYOCDfOPBIL7dG1NjODBXNoJEIHNqQdTPfQ2pAaPF',
      // apiSecret: 'ekc8AccYdDPZTv4O2kgh3qO5vcrNPXbDwJTXhc0lLV6IipBmU46vtALMexaI2JJW',
    })
    return client
  },


  timing: function (client){
    client.time().then(time => console.log(time))
  },

  checkBuy: async function (client,CONFIG){
    let result       = await client.prices();
    let initialPrice = result.NEOUSDT;
    let parsedPrice  = parseInt(result.NEOUSDT);
    let maxPrice     = parsedPrice+CONFIG.maxbuy
    let minPrice     = parsedPrice-CONFIG.minbuy

    //console.log("Trying to buy Price is : "+initialPrice+" min is: "+minPrice+" and max : "+maxPrice);
    //initialPrice = maxPrice
    if (minPrice <= initialPrice  && initialPrice <= maxPrice) {
      return initialPrice
    }else{
      return false
    }
  },

  checkSell: async function (client,price,CONFIG){
    const result = await client.prices();
    initialPrice = result.NEOUSDT;
    parsedPrice  = parseInt(price);
    let maxPrice = parsedPrice+CONFIG.maxsell
    let minPrice = parsedPrice-CONFIG.minsell

    //console.log("Trying to sell Price is : "+initialPrice+" min is: "+minPrice+" and max : "+maxPrice);
    //initialPrice = parsedPrice+0.5
    if (initialPrice <= minPrice  || maxPrice <= initialPrice ) {
      return initialPrice
    }else{
      if (initialPrice > parsedPrice+0.5) {
        CONFIG.minsell = -0.47
        return false
      }else{
        return false
      }
    }
  },

  buy: async function (client,budget) {

    var price = await this.getPrice(client)

    var quantity = ((budget-(budget*0.003))/price).toFixed(2);

    const result = await client.order({
      symbol: 'NEOUSDT',
      side: 'BUY',
      type: 'MARKET',
      //price: 30,
      //type: 'LIMIT',
      quantity: quantity,
    })

    if (result) {
      let obj = { state: true, quantity: quantity }
      return obj
    }else{
      let obj = { state: false, msg: 'Error in order this could be caused by insufficient balance or quantity' }
      return obj
    }

    // let obj = { state: true, quantity: quantity }
    // return obj
  },


  sell: async function (client,quantity) {
    //await client.order({
    const result = await client.order({
      symbol: 'NEOUSDT',
      side: 'SELL',
      type: 'MARKET',
      //type: 'LIMIT',

      //price: 40,
      quantity: quantity,
    })

    if (result) {
      let obj = { state: true, result: result }
      return obj
    }else{
      let obj = { state: false, msg: 'Error in order this could be caused by insufficient balance or quantity' }
      return obj
    }

    // let obj = { state: true, result: result }
    // return obj
  },

  getPrice: async function (client){
    const result = await client.prices();
    initialPrice = result.NEOUSDT;
    return initialPrice
  }
}
