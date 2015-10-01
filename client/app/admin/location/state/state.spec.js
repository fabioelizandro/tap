'use strict';

describe('State: State States', function () {

  beforeEach(module('tapApp'));

  var $state;

  beforeEach(inject(function (_$state_) {
    $state = _$state_;
  }));

  describe('admin.state', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.state');
    });

    it('should be abstract', function () {
      expect(state.abstract).toBe(true);
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/state');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/location/state/state.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('StateController as base');
    });
  });

  describe('admin.state.index', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.state.index');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/location/state/state-index.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('StateIndexController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });

  describe('admin.state.new', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.state.new');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/new');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/location/state/state-new.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('StateNewController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });

  describe('admin.state.edit', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.state.edit');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/:id/edit');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/location/state/state-edit.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('StateEditController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });
});
