'use strict';

describe('Service: City', function () {

  var City, $httpBackend;

  beforeEach(module('tapApp'));

  beforeEach(inject(function (_City_, _$httpBackend_) {
    City = _City_;
    $httpBackend = _$httpBackend_;
  }));

  it('is a valid resource', function () {
    expect(City.name).toEqual('Resource');
  });

  describe('#get', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/cities/1')
        .respond(200, {_id: 1, name: 'Awesome Resource'});
    });
    it('returns a single resource', function () {
      var city = City.get({id: 1});
      $httpBackend.flush();

      expect(city._id).toEqual(1);
    });
  });

  describe('#query', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/cities')
        .respond(200, [{_id: 1, name: 'Awesome Resource'}]);
    });

    it('returns a collection of the resource', function () {
      var cities = City.query();
      $httpBackend.flush();

      expect(cities[0]._id).toEqual(1);
    });
  });

  describe('#save', function () {
    beforeEach(function () {
      $httpBackend.expectPOST('/api/cities')
        .respond(201, {_id: 2, name: 'Saved Resource'});
    });

    it('saves a resource', function () {
      var city = City.save();
      $httpBackend.flush();

      expect(city._id).toEqual(2);
    });
  });

  describe('#update', function () {
    beforeEach(function () {
      $httpBackend.expectPUT('/api/cities/2')
        .respond(200, {_id: 2, name: 'Updated Resource'});
    });

    it('updates a resource', function () {
      var city = City.update({_id: 2, name: 'Updated Resource'});
      $httpBackend.flush();

      expect(city.name).toEqual('Updated Resource');
    });
  });

  describe('#delete', function () {
    beforeEach(function () {
      $httpBackend.expectDELETE('/api/cities/2')
        .respond(200, {_id: 2, name: 'Removed Resource'});
    });

    it('removes a resource', function () {
      var city = City.delete({id: 2});
      $httpBackend.flush();

      expect(city.name).toEqual('Removed Resource');
    });
  });
});
