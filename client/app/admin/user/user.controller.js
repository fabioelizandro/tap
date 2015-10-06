(function () {
  'use strict';

  angular.module('tapApp')
    .controller('UserController', UserController);

  UserController.$inject = ['User', 'notifier', 'resourceManager', 'ENUM'];

  function UserController(User, notifier, resourceManager, ENUM) {
    var vm = this;

    vm.userTypes = ENUM.get('petType');
    vm.users = User.query({role: 'admin'});
    vm.destroy = destroy;

    function destroy(user, users) {
      resourceManager
        .destroy(user, users)
        .then(function () {
          notifier.notify('Usuário deletado com sucesso', 'success');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Não foi possível deletar o usuário, tente mais tarde.', 'danger');
          }
        });
    }
  }
})();
