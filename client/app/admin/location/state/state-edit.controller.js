(function () {
  'use strict';

  angular.module('tapApp')
    .controller('StateEditController', StateEditController);

  StateEditController.$inject = ['State', '$state', 'resourceManager', 'notifier'];

  function StateEditController(State, $state, resourceManager, notifier) {
    var vm = this;

    vm.state = State.get({id: $state.params.id});
    vm.update = update;

    function update(form, state, states) {
      resourceManager
        .update(state, states, form)
        .then(function () {
          notifier.notify('Estado atualizado com sucesso!', 'success');
          $state.go('admin.state.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu ao atualizar', 'error');
          }
        });
    }
  }
})();
