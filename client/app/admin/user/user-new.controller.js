(function () {
  'use strict';

  angular.module('tapApp')
    .controller('UserNewController', UserNewController);

  UserNewController.$inject = ['User', 'resourceManager', 'notifier', '$state'];

  function UserNewController(User, resourceManager, notifier, $state) {
    var vm = this;

    vm.user = new User({role: 'admin'});
    vm.create = create;

    function create(form, user, users) {
      resourceManager
        .create(user, users, form)
        .then(function () {
          notifier.notify('Usuário cadastrado com sucesso!', 'success');
          $state.go('admin.user.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu!', 'danger');
          }
        });
    }
  }
})();
