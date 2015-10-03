(function () {
  'use strict';

  angular.module('tapApp')
    .factory('City', CityFactory);

  CityFactory.$inject = ['$resource'];

  function CityFactory($resource) {
    var resource = $resource('/api/cities/:id/:controller', {id: '@_id'}, {
      update: {method: 'PUT'}
    });

    return resource;
  }
})();
