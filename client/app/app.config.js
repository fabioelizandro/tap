(function () {
  'use strict';

  angular.module('tapApp')
    .config(uiGMapConfiguration)
    .config(routerConfiguration);

  uiGMapConfiguration.$inject = ['uiGmapGoogleMapApiProvider'];

  function uiGMapConfiguration(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      v: '3.17',
      libraries: 'places',
      language: 'pt'
    });
  }

  routerConfiguration.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function routerConfiguration($urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .when('/admin', function ($state) {
        $state.go('admin.dashboard');
      })
      .when('/admin/', function ($state) {
        $state.go('admin.dashboard');
      });

    $urlRouterProvider.otherwise(function ($injector) {
      $injector.get('$state').go('main.home');
    });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }

})();
