'use strict';

describe('State: User States', function () {

  beforeEach(module('tapApp'));

  var $state;

  beforeEach(inject(function (_$state_) {
    $state = _$state_;
  }));

  describe('admin.user', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.user');
    });

    it('should be abstract', function () {
      expect(state.abstract).toBe(true);
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/user');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/user/user.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('UserController as base');
    });
  });

  describe('admin.user.index', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.user.index');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/user/user-index.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('UserIndexController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });

  describe('admin.user.new', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.user.new');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/new');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/user/user-new.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('UserNewController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });

  describe('admin.user.edit', function () {
    var state;

    beforeEach(function () {
      state = $state.get('admin.user.edit');
    });

    it('should not be abstract', function () {
      expect(state.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(state.url).toEqual('/:id/edit');
    });

    it('renders the html', function () {
      expect(state.templateUrl).toEqual('app/admin/user/user-edit.html');
    });

    it('uses the right controller', function () {
      expect(state.controller).toEqual('UserEditController as vm');
    });

    it('restricts to admin role', function () {
      expect(state.role).toEqual('admin');
    });
  });
});
