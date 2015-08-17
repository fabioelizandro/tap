var Seeder = require('./seeder');
var State = require('./../../api/state/state.model');
var states = require('./list-of-states');

var seeder = new Seeder(State);

states.arrayOfStates.forEach(function(state){
  var stateInfos = state.split(",");
  seeder.add({
    name: stateInfos[1].trim(),
    acronym: stateInfos[2].trim().toUpperCase()
  }, stateInfos[2].trim());
});

module.exports = seeder;
