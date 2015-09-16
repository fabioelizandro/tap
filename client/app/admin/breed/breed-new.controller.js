(function () {
  'use strict';

  angular.module('tapApp')
    .controller('BreedNewController', BreedNewController);

  BreedNewController.$inject = ['Breed', 'resourceManager', 'notifier', '$state'];

  function BreedNewController(Breed, resourceManager, notifier, $state) {
    var vm = this;

    vm.breed = new Breed();
    vm.create = create;

    function create(form, breed, breeds) {
      resourceManager
        .create(breed, breeds, form)
        .then(function () {
          notifier.notify('Raça cadastrada com sucesso!', 'success');
          $state.go('admin.breed.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu!', 'danger');
          }
        });
    }
  }
})();
