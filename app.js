

const Binance = require('binance-api-node').default

// Authenticated client, can make signed calls
const client = Binance({
  apiKey: 'v8p7eZ2MxTioNr04JjQN30En3p3tebr6NwlU4di4k7dHwHc80wwyJ4HHsu00daIt',
  apiSecret: 'vYMG05xBmI9eo0GQslWYAfIoSbvtFrUfjape1Fg5UnWWEHOS1rxF8T2otISlCGW9',

  // apiKey: '9iYXsX3ymtHoZIJf1fMXIsqzYOCDfOPBIL7dG1NjODBXNoJEIHNqQdTPfQ2pAaPF',
  // apiSecret: 'ekc8AccYdDPZTv4O2kgh3qO5vcrNPXbDwJTXhc0lLV6IipBmU46vtALMexaI2JJW',
})

//client.time().then(time => console.log(time))

var initialPrice = 0;

const far = async function (){
  const result = await client.prices();
  initialPrice = result.NEOUSDT;
  parsedPrice  = parseInt(result.NEOUSDT);
  let maxPrice = parsedPrice+0.12
  let minPrice = parsedPrice

  console.log("Trying to buy Price is : "+initialPrice+" min is: "+minPrice+" and max : "+maxPrice);

  if (minPrice <= initialPrice  && initialPrice <= maxPrice) {
    return initialPrice
  }else{
    return false
  }
  //return initialPrice
}

const bar = async function (buyAtPrice){
  const result = await client.prices();
  initialPrice = result.NEOUSDT;
  parsedPrice  = parseInt(buyAtPrice);
  let maxPrice = parsedPrice+0.58
  let minPrice = parsedPrice-0.1

  console.log("Trying to sell Price is : "+initialPrice+" min is: "+minPrice+" and max : "+maxPrice);

  if (initialPrice <= minPrice  || maxPrice <= initialPrice ) {
    return initialPrice
  }else{
    return false
  }
}

const getPrice = async function (){
  const result = await client.prices();
  initialPrice = result.NEOUSDT;
  return initialPrice
}

const buy = async function (budget) {
  //await client.order({
  var price = await getPrice()

  var quantity = ((budget-(budget*0.003))/price).toFixed(2);

  console.log(quantity);
  const result = await client.order({
    symbol: 'NEOUSDT',
    side: 'BUY',
    type: 'MARKET',
    //price: 30,
    //type: 'LIMIT',
    quantity: quantity,
  })
  console.log(result);
  if (result) {
    return quantity
  }else{
    return "No result"
  }

}

const sell = async function (quantity) {
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
    return result
  }else{
    return false
  }

}

// const testSell = async value => {
//     result = await sell()
//     console.log(result);
// }
//
// testSell(1).then(() => console.log('all done!'))


// const testBuy = async value => {
//     result = await buy(10)
//     console.log(result);
// }
//
// testBuy(1).then(() => console.log('all done!'))



const loop = async value => {

  console.log("\n---------------------------------------");
  let result = false
  while (!result) {
    result = await far()
    await sleep(10);
  }
  buyAtPrice = result
  console.log("I will buy at price : " + buyAtPrice);
  console.log("---------------------------------------\n");

  let quantityBuy = await buy(10)

  if (quantityBuy) {
    // console.log("I have purchsed "+saleBuy.symbol+" with price : "+saleBuy.price+" and quantity : "+saleBuy.origQty);
    // buyAtPrice = saleBuy.price
    console.log("quantite acheté : "+quantityBuy);
  }else{
    return false
  }
  // console.log("\n---------------------------------------");
  // console.log(saleBuy);
  // console.log("\n---------------------------------------");

  console.log("\n---------------------------------------");
  result = false
  while (!result) {
    result = await bar(buyAtPrice)
    await sleep(10);
  }
  sellAtPrice = result
  console.log("I will sell at price : " + sellAtPrice);
  console.log("---------------------------------------\n");
  let sold = await sell(quantityBuy)

  if (sold) {
    // console.log("I have purchsed "+saleBuy.symbol+" with price : "+saleBuy.price+" and quantity : "+saleBuy.origQty);
    // buyAtPrice = saleBuy.price
    console.log(sold);
  }else{
    return false
  }

  console.log("\n---------------------------------------");
  let som = sellAtPrice-buyAtPrice
  console.log(" Transaction result :: "+som);
  console.log("---------------------------------------\n");
}

//loop(1).then(() => console.log('all done!'))














// ---------------------------------------------------------------------------------------------

const vorpal = require('vorpal')();
const chalk = require('chalk');
const Table = require('cli-table');

vorpal
  .command('say [words...]')
  .option('-b, --backwards')
  .option('-t, --twice')
  .action(function (args, callback) {
    let str = args.words.join(' ');
    str = (args.options.backwards) ?
      str.split('').reverse().join('') :
      str;
    this.log(str);
    callback();
  });


vorpal.show();

vorpal.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

const table = new Table({ head: ["", "Top Header 1", "Top Header 2"] });

table.push(
    { 'Left Header 1': ['Value Row 1 Col 1', 'Value Row 1 Col 2'] }
  , { 'Left Header 2': ['Value Row 2 Col 1', 'Value Row 2 Col 2'] }
);

vorpal.log(table.toString());

vorpal.ui.redraw('\n\n' + Math.random() + '\n\n');

vorpal.ui.redraw.clear();
