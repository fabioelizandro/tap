'use strict';

describe('State: Breed States', function () {

  beforeEach(module('tapApp'));

  var $state;

  beforeEach(inject(function (_$state_) {
    $state = _$state_;
  }));

  describe('admin.breed', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.breed');
    });

    it('should be abstract', function () {
      expect(state.abstract).toBe(true);
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/breed');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/breed/breed.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('BreedController as base');
    });
  });

  describe('admin.breed.index', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.breed.index');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/breed/breed-index.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('BreedIndexController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });

  describe('admin.breed.new', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.breed.new');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/new');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/breed/breed-new.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('BreedNewController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });

  describe('admin.breed.edit', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.breed.edit');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/:id/edit');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/breed/breed-edit.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('BreedEditController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });
});
