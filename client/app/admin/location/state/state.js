(function () {
  'use strict';

  angular.module('tapApp')
    .config(stateConfig);

  function stateConfig($stateProvider) {
    $stateProvider
      .state('admin.state', {
        abstract: true,
        url: '/state',
        templateUrl: 'app/admin/location/state/state.html',
        controller: 'StateController as base'
      })
      .state('admin.state.index', {
        url: '',
        templateUrl: 'app/admin/location/state/state-index.html',
        controller: 'StateIndexController as vm',
        role: 'admin'
      })
      .state('admin.state.new', {
        url: '/new',
        templateUrl: 'app/admin/location/state/state-new.html',
        controller: 'StateNewController as vm',
        role: 'admin'
      })
      .state('admin.state.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/location/state/state-edit.html',
        controller: 'StateEditController as vm',
        role: 'admin'
      });
  }
})();
