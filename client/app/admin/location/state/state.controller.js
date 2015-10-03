(function () {
  'use strict';

  angular.module('tapApp')
    .controller('StateController', StateController);

  StateController.$inject = ['State', 'notifier', 'resourceManager'];

  function StateController(State, notifier, resourceManager) {
    var vm = this;

    vm.states = State.query();
    vm.destroy = destroy;

    function destroy(state, states) {
      resourceManager
        .destroy(state, states)
        .then(function () {
          notifier.notify('Estado deletado com sucesso', 'success');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Não foi possível deletar o estado, tente mais tarde.', 'danger');
          }
        });
    }
  }
})();
