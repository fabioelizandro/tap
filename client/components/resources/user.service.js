(function () {
  'use strict';

  angular.module('tapApp')
    .factory('User', UserFactory);

  UserFactory.$inject = ['$resource'];

  function UserFactory($resource) {
    var resource = $resource('/api/users/:id/:controller', {id: '@_id'}, {
      update: {method: 'PUT'}
    });

    return resource;
  }
})();
