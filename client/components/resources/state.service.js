(function () {
  'use strict';

  angular.module('tapApp')
    .factory('State', StateFactory);

  StateFactory.$inject = ['$resource'];

  function StateFactory($resource) {
    var resource = $resource('/api/states/:id/:controller', {id: '@_id'}, {
      update: {method: 'PUT'}
    });

    return resource;
  }
})();
