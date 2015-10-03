(function () {
  'use strict';

  angular.module('tapApp')
    .config(cityConfig);

  function cityConfig($stateProvider) {
    $stateProvider
      .state('admin.city', {
        abstract: true,
        url: '/city/:state',
        templateUrl: 'app/admin/location/city/city.html',
        controller: 'CityController as base'
      })
      .state('admin.city.index', {
        url: '',
        templateUrl: 'app/admin/location/city/city-index.html',
        controller: 'CityIndexController as vm',
        role: 'admin'
      })
      .state('admin.city.new', {
        url: '/new',
        templateUrl: 'app/admin/location/city/city-new.html',
        controller: 'CityNewController as vm',
        role: 'admin'
      })
      .state('admin.city.edit', {
        url: '/:id/edit',
        templateUrl: 'app/admin/location/city/city-edit.html',
        controller: 'CityEditController as vm',
        role: 'admin'
      });
  }
})();
