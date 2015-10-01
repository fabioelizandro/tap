'use strict';

describe('Service: State', function () {

  var State, $httpBackend;

  beforeEach(module('tapApp'));

  beforeEach(inject(function (_State_, _$httpBackend_) {
    State = _State_;
    $httpBackend = _$httpBackend_;
  }));

  it('is a valid resource', function () {
    expect(State.name).toEqual('Resource');
  });

  describe('#get', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/states/1')
        .respond(200, {_id: 1, name: 'Awesome Resource'});
    });
    it('returns a single resource', function () {
      var state = State.get({id: 1});
      $httpBackend.flush();

      expect(state._id).toEqual(1);
    });
  });

  describe('#query', function () {
    beforeEach(function () {
      $httpBackend.expectGET('/api/states')
        .respond(200, [{_id: 1, name: 'Awesome Resource'}]);
    });

    it('returns a collection of the resource', function () {
      var states = State.query();
      $httpBackend.flush();

      expect(states[0]._id).toEqual(1);
    });
  });

  describe('#save', function () {
    beforeEach(function () {
      $httpBackend.expectPOST('/api/states')
        .respond(201, {_id: 2, name: 'Saved Resource'});
    });

    it('saves a resource', function () {
      var state = State.save();
      $httpBackend.flush();

      expect(state._id).toEqual(2);
    });
  });

  describe('#update', function () {
    beforeEach(function () {
      $httpBackend.expectPUT('/api/states/2')
        .respond(200, {_id: 2, name: 'Updated Resource'});
    });

    it('updates a resource', function () {
      var state = State.update({_id: 2, name: 'Updated Resource'});
      $httpBackend.flush();

      expect(state.name).toEqual('Updated Resource');
    });
  });

  describe('#delete', function () {
    beforeEach(function () {
      $httpBackend.expectDELETE('/api/states/2')
        .respond(200, {_id: 2, name: 'Removed Resource'});
    });

    it('removes a resource', function () {
      var state = State.delete({id: 2});
      $httpBackend.flush();

      expect(state.name).toEqual('Removed Resource');
    });
  });
});
