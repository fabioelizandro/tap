(function () {
  'use strict';

  angular.module('tapApp')
    .controller('CityController', CityController);

  CityController.$inject = ['City', 'State', 'notifier', 'resourceManager', '$state'];

  function CityController(City, State, notifier, resourceManager, $state) {
    var vm = this;

    vm.state = State.get({id: $state.params.state});
    vm.cities = City.query();
    vm.destroy = destroy;

    function destroy(city, cities) {
      resourceManager
        .destroy(city, cities)
        .then(function () {
          notifier.notify('Cidade deletada com sucesso', 'success');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Não foi possível deletar a cidade, tente mais tarde.', 'danger');
          }
        });
    }
  }
})();
