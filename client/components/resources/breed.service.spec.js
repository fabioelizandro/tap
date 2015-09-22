'use strict';

describe('Service: Breed', function () {

  var Breed, $httpBackend;

  beforeEach(module('tapApp'));

  beforeEach(inject(function (_Breed_, _$httpBackend_) {
    Breed = _Breed_;
    $httpBackend = _$httpBackend_;
  }));

  it('is a valid resource', function () {
    expect(Breed.name).toEqual('Resource');
  });

  describe('#get', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/breeds/1')
        .respond(200, {_id: 1, name: 'Awesome Resource'});
    });
    it('returns a single resource', function () {
      var breed = Breed.get({id: 1});
      $httpBackend.flush();

      expect(breed._id).toEqual(1);
    });
  });

  describe('#query', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/breeds')
        .respond(200, [{_id: 1, name: 'Awesome Resource'}]);
    });

    it('returns a collection of the resource', function () {
      var breeds = Breed.query();
      $httpBackend.flush();

      expect(breeds[0]._id).toEqual(1);
    });
  });

  describe('#save', function () {
    beforeEach(function () {
      $httpBackend.expectPOST('/api/breeds')
        .respond(201, {_id: 2, name: 'Saved Resource'});
    });

    it('saves a resource', function () {
      var breed = Breed.save();
      $httpBackend.flush();

      expect(breed._id).toEqual(2);
    });
  });

  describe('#update', function () {
    beforeEach(function () {
      $httpBackend.expectPUT('/api/breeds/2')
        .respond(200, {_id: 2, name: 'Updated Resource'});
    });

    it('updates a resource', function () {
      var breed = Breed.update({_id: 2, name: 'Updated Resource'});
      $httpBackend.flush();

      expect(breed.name).toEqual('Updated Resource');
    });
  });

  describe('#delete', function () {
    beforeEach(function () {
      $httpBackend.expectDELETE('/api/breeds/2')
        .respond(200, {_id: 2, name: 'Removed Resource'});
    });

    it('removes a resource', function () {
      var breed = Breed.delete({id: 2});
      $httpBackend.flush();

      expect(breed.name).toEqual('Removed Resource');
    });
  });
});
