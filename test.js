
const Funcs = require('./functions')
const Utils = require('./utils')
const Vorpals = require('./vorpals')

let CONFIG = {
  pkey: '9iYXsX3ymtHoZIJf1fMXIsqzYOCDfOPBIL7dG1NjODBXNoJEIHNqQdTPfQ2pAaPF',
  skey: 'ekc8AccYdDPZTv4O2kgh3qO5vcrNPXbDwJTXhc0lLV6IipBmU46vtALMexaI2JJW',
  maxbuy: 0.12,
  minbuy: 0,
  maxsell: 2,
  minsell: 0.1,
  budget: 11,
  timing: 10,
  gain: 0,
}


let vorpal = Vorpals.init()

vorpal
  .command('start')
  .option('-b <budget>, --budget')
  .option('-t <timing>, --timing')
  .action(function ( { options }, callback) {
    if (options.b && options.t) {
      if (!isNaN(options.b) && !isNaN(options.t)) {
        CONFIG.budget = options.b
        CONFIG.timing = options.t
        Vorpals.msgSuccess(vorpal,"Config changed! New params : \n >> Budget : "+CONFIG.budget+"$ \n >> Timing : "+CONFIG.timing+"s")
      }else{
        Vorpals.msgError(vorpal,"You should give a valid integer value to all params!")
        callback();
      }
    }else{
      Vorpals.msgWarning(vorpal,"No budget and timing given! Starting Bot with defaults  : \n >> Budget : "+CONFIG.budget+"$ \n >> Timing : "+CONFIG.timing+"s")
    }
    Vorpals.msgFlash(vorpal,"Bot started with config : \n >> Budget : "+CONFIG.budget+"$ and timing : "+CONFIG.timing+"s \n >> Buy between price: "+CONFIG.minbuy+" and "+CONFIG.maxbuy+" \n >> Sell between price: "+CONFIG.minsell+" and "+CONFIG.maxsell)
    startCheck().then(() => {
      console.log('all done!')
      callback();
    })
  });

vorpal
  .command('config')
  .option('-h <maxbuy>, --maxbuy')
  .option('-l <minbuy>, --minbuy')
  .option('-b <maxsell>, --maxsell')
  .option('-w <minsell>, --minsell')
  .action(function ({ options }, callback) {
    if (!isNaN(options.h) && !isNaN(options.l) && !isNaN(options.b) && !isNaN(options.w)) {
      CONFIG.maxbuy = options.h
      CONFIG.minbuy = options.l
      CONFIG.maxsell = options.b
      CONFIG.minsell = options.w
      Vorpals.msgSuccess(vorpal,"Config changed! New params config : \n >> Buy between price: "+CONFIG.minbuy+" and "+CONFIG.maxbuy+" \n >> Sell between price: "+CONFIG.minsell+" and "+CONFIG.maxsell)
      callback();
    }else{
      Vorpals.msgError(vorpal,"You should give a valid integer value to all params!")
      callback();
    }

  });

vorpal
  .command('apikey')
  .option('-p <public>, --public')
  .option('-s <secret>, --secret')
  .action(function ({ options }, callback) {
    if (options.p && options.s) {
      CONFIG.pkey = options.p
      CONFIG.skey = options.s
      Vorpals.msgSuccess(vorpal,"Config changed! New Api keys : \n >> Public : "+CONFIG.pkey+" \n >> Secret: "+CONFIG.s)
    }else{
      //if () {
        //TODO check api validity keys
      //}
      Vorpals.msgError(vorpal,"You should give a valid API Keys!")
    }
    callback();
  });

Vorpals.show(vorpal)

//let timing = Funcs.timing(client)

const startCheck = async () => {

  for (var i = 0; i < i+1; i++) {
    let client = Funcs.init(CONFIG);

    Vorpals.msgFlash(vorpal, "Starting Buy Script");
    let buyAtPrice = false
    while (!buyAtPrice) {
      await Utils.sleep(CONFIG.timing);
      buyAtPrice = await Funcs.checkBuy(client,CONFIG)
    }

    Vorpals.msgFlash(vorpal, "I will buy at price : " + buyAtPrice);

    let responseBuy = await Funcs.buy(client,CONFIG.budget)
    if (responseBuy.state) {
      Vorpals.msgSuccess(vorpal,"I did buy the quantity of : "+responseBuy.quantity);
    }else{
      Vorpals.msgError(vorpal,"Error in order this could be caused by insufficient balance or quantity")
      Vorpals.msgWarning(vorpal, "Stoping script for 5min before restart");
      await Utils.sleep(300);
      return startCheck()
    }

    Vorpals.msgFlash(vorpal, "Starting Sell Script");
    sellAtPrice = false
    while (!sellAtPrice) {
      await Utils.sleep(CONFIG.timing);
      sellAtPrice = await Funcs.checkSell(client,buyAtPrice,CONFIG)
    }
    Vorpals.msgFlash(vorpal, "I will sell at price : " + sellAtPrice);

    let responseSell = await Funcs.sell(client,responseBuy.quantity)
    let som = sellAtPrice-buyAtPrice
    if (responseSell.state) {
      Vorpals.msgSuccess(vorpal,"I did sell the quantity");
      Vorpals.msgFlash(vorpal, "Transaction done with result : " + som);
      if (som > 0) {
        CONFIG.gain++
        if (CONFIG.gain > 1) {
          return false
        }else{
          Vorpals.msgWarning(vorpal, "Stoping script for 40min No Morroco Time :D");
          await Utils.sleep(2700);
          return startCheck()
        }
      }else{
        CONFIG.gain--
        Vorpals.msgWarning(vorpal, "Stoping script for 40min No Morroco Time :D");
        await Utils.sleep(2700);
        return startCheck()
      }

    }else{
      Vorpals.msgError(vorpal,"Error in order this could be caused by insufficient balance or quantity")
      Vorpals.msgWarning(vorpal, "Stoping script for 5min before restart");
      await Utils.sleep(300);
      return startCheck()
    }


  }


}
