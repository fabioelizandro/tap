(function () {
  'use strict';

  angular.module('tapApp')
    .controller('CityNewController', CityNewController);

  CityNewController.$inject = ['City', 'resourceManager', 'notifier', '$state'];

  function CityNewController(City, resourceManager, notifier, $state) {
    var vm = this;

    vm.city = new City();
    vm.create = create;

    function create(form, state, city, cities) {
      city.state = state._id;

      resourceManager
        .create(city, cities, form)
        .then(function () {
          notifier.notify('Cidade cadastrada com sucesso!', 'success');
          $state.go('admin.city.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu!', 'danger');
          }
        });
    }
  }
})();
