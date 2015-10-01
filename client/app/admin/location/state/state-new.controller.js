(function () {
  'use strict';

  angular.module('tapApp')
    .controller('StateNewController', StateNewController);

  StateNewController.$inject = ['State', 'resourceManager', 'notifier', '$state'];

  function StateNewController(State, resourceManager, notifier, $state) {
    var vm = this;

    vm.state = new State();
    vm.create = create;

    function create(form, state, states) {
      resourceManager
        .create(state, states, form)
        .then(function () {
          notifier.notify('Estado cadastrado com sucesso!', 'success');
          $state.go('admin.state.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu!', 'danger');
          }
        });
    }
  }
})();
