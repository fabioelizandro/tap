(function () {
  'use strict';

  angular.module('tapApp')
    .controller('CityEditController', CityEditController);

  CityEditController.$inject = ['City', '$state', 'resourceManager', 'notifier'];

  function CityEditController(City, $state, resourceManager, notifier) {
    var vm = this;

    vm.city = City.get({id: $state.params.id});
    vm.update = update;

    function update(form, city, cities) {
      resourceManager
        .update(city, cities, form)
        .then(function () {
          notifier.notify('Cidade atualizada com sucesso!', 'success');
          $state.go('admin.city.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu ao atualizar', 'error');
          }
        });
    }
  }
})();
