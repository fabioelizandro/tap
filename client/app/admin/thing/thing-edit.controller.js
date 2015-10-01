(function () {
  'use strict';

  angular.module('tapApp')
    .controller('ThingEditController', ThingEditController);

  ThingEditController.$inject = ['Thing', '$state', 'resourceManager', 'notifier'];

  function ThingEditController(Thing, $state, resourceManager, notifier) {
    var vm = this;

    vm.thing = Thing.get({id: $state.params.id});
    vm.update = update;

    function update(form, thing, things) {
      resourceManager
        .update(thing, things, form)
        .then(function () {
          notifier.notify('Coisa atualizada com sucesso!', 'success');
          $state.go('admin.thing.index');
        })
        .catch(function (error) {
          if (error) {
            notifier.notify('Algum erro ocorreu ao atualizar', 'error');
          }
        });
    }
  }
})();
