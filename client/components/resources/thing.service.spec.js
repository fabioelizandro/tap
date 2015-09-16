'use strict';

describe('Service: Thing', function () {

  var Thing, $httpBackend;

  beforeEach(module('tapApp'));

  beforeEach(inject(function (_Thing_, _$httpBackend_) {
    Thing = _Thing_;
    $httpBackend = _$httpBackend_;
  }));

  it('is a valid resource', function () {
    expect(Thing.name).toEqual('Resource');
  });

  describe('#get', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/things/1')
        .respond(200, {_id: 1, name: 'Awesome Resource'});
    });
    it('returns a single resource', function () {
      var thing = Thing.get({id: 1});
      $httpBackend.flush();

      expect(thing._id).toEqual(1);
    });
  });

  describe('#query', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/things')
        .respond(200, [{_id: 1, name: 'Awesome Resource'}]);
    });

    it('returns a collection of the resource', function () {
      var things = Thing.query();
      $httpBackend.flush();

      expect(things[0]._id).toEqual(1);
    });
  });

  describe('#save', function () {
    beforeEach(function () {
      $httpBackend.expectPOST('/api/things')
        .respond(201, {_id: 2, name: 'Saved Resource'});
    });

    it('saves a resource', function () {
      var thing = Thing.save();
      $httpBackend.flush();

      expect(thing._id).toEqual(2);
    });
  });

  describe('#update', function () {
    beforeEach(function () {
      $httpBackend.expectPUT('/api/things/2')
        .respond(200, {_id: 2, name: 'Updated Resource'});
    });

    it('updates a resource', function () {
      var thing = Thing.update({_id: 2, name: 'Updated Resource'});
      $httpBackend.flush();

      expect(thing.name).toEqual('Updated Resource');
    });
  });

  describe('#delete', function () {
    beforeEach(function () {
      $httpBackend.expectDELETE('/api/things/2')
        .respond(200, {_id: 2, name: 'Removed Resource'});
    });

    it('removes a resource', function () {
      var thing = Thing.delete({id: 2});
      $httpBackend.flush();

      expect(thing.name).toEqual('Removed Resource');
    });
  });
});
