(function () {
  'use strict';

  angular.module('tapApp')
    .config(breedConfig);

  function breedConfig($stateProvider) {
    $stateProvider
      .state('admin.breed', {
        abstract: true,
        url: '/breed',
        templateUrl: 'app/admin/breed/breed.html',
        controller: 'BreedController as base'
      })
      .state('admin.breed.index', {
        url: '',
        templateUrl: 'app/admin/breed/breed-index.html',
        controller: 'BreedIndexController as vm',
        role: 'admin'
      })
      .state('admin.breed.new', {
        url: '/new',
        templateUrl: 'app/admin/breed/breed-new.html',
        controller: 'BreedNewController as vm',
        role: 'admin'
      })
      .state('admin.breed.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/breed/breed-edit.html',
        controller: 'BreedEditController as vm',
        role: 'admin'
      });
  }
})();
