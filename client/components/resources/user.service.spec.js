'use strict';

describe('Service: User', function () {

  var User, $httpBackend;

  beforeEach(module('tapApp'));

  beforeEach(inject(function (_User_, _$httpBackend_) {
    User = _User_;
    $httpBackend = _$httpBackend_;
  }));

  it('is a valid resource', function () {
    expect(User.name).toEqual('Resource');
  });

  describe('#get', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/users/1')
        .respond(200, {_id: 1, name: 'Awesome Resource'});
    });
    it('returns a single resource', function () {
      var user = User.get({id: 1});
      $httpBackend.flush();

      expect(user._id).toEqual(1);
    });
  });

  describe('#query', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/users')
        .respond(200, [{_id: 1, name: 'Awesome Resource'}]);
    });

    it('returns a collection of the resource', function () {
      var users = User.query();
      $httpBackend.flush();

      expect(users[0]._id).toEqual(1);
    });
  });

  describe('#save', function () {
    beforeEach(function () {
      $httpBackend.expectPOST('/api/users')
        .respond(201, {_id: 2, name: 'Saved Resource'});
    });

    it('saves a resource', function () {
      var user = User.save();
      $httpBackend.flush();

      expect(user._id).toEqual(2);
    });
  });

  describe('#update', function () {
    beforeEach(function () {
      $httpBackend.expectPUT('/api/users/2')
        .respond(200, {_id: 2, name: 'Updated Resource'});
    });

    it('updates a resource', function () {
      var user = User.update({_id: 2, name: 'Updated Resource'});
      $httpBackend.flush();

      expect(user.name).toEqual('Updated Resource');
    });
  });

  describe('#delete', function () {
    beforeEach(function () {
      $httpBackend.expectDELETE('/api/users/2')
        .respond(200, {_id: 2, name: 'Removed Resource'});
    });

    it('removes a resource', function () {
      var user = User.delete({id: 2});
      $httpBackend.flush();

      expect(user.name).toEqual('Removed Resource');
    });
  });
});
