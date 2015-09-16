(function () {
  'use strict';

  angular.module('tapApp')
    .factory('Breed', BreedFactory);

  BreedFactory.$inject = ['$resource'];

  function BreedFactory($resource) {
    var resource = $resource('/api/breeds/:id/:controller', {id: '@_id'}, {
      update: {method: 'PUT'}
    });

    return resource;
  }
})();
