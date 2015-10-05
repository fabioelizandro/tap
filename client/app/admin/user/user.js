(function () {
  'use strict';

  angular.module('tapApp')
    .config(userConfig);

  function userConfig($stateProvider) {
    $stateProvider
      .state('admin.user', {
        abstract: true,
        url: '/user',
        templateUrl: 'app/admin/user/user.html',
        controller: 'UserController as base'
      })
      .state('admin.user.index', {
        url: '',
        templateUrl: 'app/admin/user/user-index.html',
        controller: 'UserIndexController as vm',
        role: 'admin'
      })
      .state('admin.user.new', {
        url: '/new',
        templateUrl: 'app/admin/user/user-new.html',
        controller: 'UserNewController as vm',
        role: 'admin'
      })
      .state('admin.user.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/user/user-edit.html',
        controller: 'UserEditController as vm',
        role: 'admin'
      });
  }
})();
