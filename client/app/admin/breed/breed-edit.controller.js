(function () {
  'use strict';

  angular.module('tapApp')
    .controller('BreedEditController', BreedEditController);

  BreedEditController.$inject = ['Breed', '$state', 'resourceManager', 'notifier'];

  function BreedEditController(Breed, $state, resourceManager, notifier) {
    var vm = this;

    vm.breed = Breed.get({id: $state.params.id});
    vm.update = update;

    function update(form, breed, breeds) {
      resourceManager
        .update(breed, breeds, form)
        .then(function () {
          notifier.notify('Raça cadastrada com sucesso!', 'success');
          $state.go('admin.breed.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu ao atualizar', 'error');
          }
        });
    }
  }
})();
