var _ = require('lodash');
var Container = require('./container');

//create the seed container
var container = new Container();

//add seeders
container.add(require('./state.seed'));
container.add(require('./city.seed'));

//build seeders references
container.build();

//run all seeders
container.run(function (err, result) {
  if (err) {
    console.log('Erro ao executar o seed, veja os erros abaixo');
    console.log(err);
  }

  console.log('\nSeed executado com sucesso dos seguintes seeders:');
  console.log(_.keys(result).toString() + '\n');
});
