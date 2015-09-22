(function () {
  'use strict';

  angular.module('tapApp')
    .controller('BreedController', BreedController);

  BreedController.$inject = ['Breed', 'notifier', 'resourceManager', 'ENUM'];

  function BreedController(Breed, notifier, resourceManager, ENUM) {
    var vm = this;

    vm.typeEnum = ENUM.get('petType');
    vm.breeds = Breed.query();
    vm.destroy = destroy;

    function destroy(breed, breeds) {
      resourceManager
        .destroy(breed, breeds)
        .then(function () {
          notifier.notify('Raça deletada com sucesso', 'success');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Não foi possível deletar a raça, tente mais tarde.', 'danger');
          }
        });
    }
  }
})();
