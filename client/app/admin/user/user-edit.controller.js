(function () {
  'use strict';

  angular.module('tapApp')
    .controller('UserEditController', UserEditController);

  UserEditController.$inject = ['User', '$state', 'resourceManager', 'notifier'];

  function UserEditController(User, $state, resourceManager, notifier) {
    var vm = this;

    vm.user = User.get({id: $state.params.id});
    vm.update = update;

    function update(form, user, users) {
      resourceManager
        .update(user, users, form)
        .then(function () {
          notifier.notify('Usuário atualizado com sucesso!', 'success');
          $state.go('admin.user.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu ao atualizar', 'error');
          }
        });
    }
  }
})();
