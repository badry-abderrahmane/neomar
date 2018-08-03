
const chalk = require('chalk');
const Table = require('cli-table');



module.exports = {

  init: function (){
    const vorpal = require('vorpal')();
    return vorpal
  },

  show: function(vorpal){
    vorpal.show();

    vorpal.log(chalk.cyan("***************************************************************"));
    vorpal.log(chalk.cyan("* Welcome to the first stable release of the NeoMar BotScript *"));
    vorpal.log(chalk.cyan("***************************************************************"));

    const table = new Table();

    table.push(
        { 'BotSystem': ['NeoMar'] },
        { 'Version':   ['v0.0.2'] },
        { 'Platform':  ['Binance'] },
        { 'Author':    ['@bd B@dry'] },
        { 'Release date':['07-2018'] }
    );

    vorpal.log(chalk.cyan(table.toString()));

    vorpal.log(chalk.cyan("***************************************************************"));
    vorpal.log(chalk.cyan("*   1- start  > start bot process                             *"));
    vorpal.log(chalk.cyan("*   2- config > set bot params                                *"));
    vorpal.log(chalk.cyan("*   3- apikey > set api params                                *"));
    vorpal.log(chalk.cyan("*   4- exit   > quit the app                                  *"));
    vorpal.log(chalk.cyan("***************************************************************"));
  },

  msgSuccess: function(vorpal,message){
      vorpal.log(chalk.green('---------------------------'));
      vorpal.log(chalk.green('\u2713 '+message));
      vorpal.log(chalk.green('---------------------------'));
  },

  msgError: function(vorpal,message){
    vorpal.log(chalk.red('!!---------------------------!!'));
    vorpal.log(chalk.red(''+message));
    vorpal.log(chalk.red('!!---------------------------!!'));
  },

  msgWarning: function(vorpal,message){
    vorpal.log(chalk.yellowBright('!!---------------------------!!'));
    vorpal.log(chalk.yellowBright(''+message));
    vorpal.log(chalk.yellowBright('!!---------------------------!!'));
  },

  msgFlash: function(vorpal,message){
    vorpal.log(chalk.cyan('\n ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'));
    vorpal.log(chalk.cyan(''+message));
    vorpal.log(chalk.cyan('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n'));
  },

}
