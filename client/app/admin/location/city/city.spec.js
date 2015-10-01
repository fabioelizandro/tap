'use strict';

describe('City: City Citys', function () {

  beforeEach(module('tapApp'));

  var $state;

  beforeEach(inject(function (_$state_) {
    $state = _$state_;
  }));

  describe('admin.city', function () {
    var city;

    beforeEach(function () {
      city = $state.get('admin.city');
    });

    it('should be abstract', function () {
      expect(city.abstract).toBe(true);
    });

    it('matches a path', function () {
      expect(city.url).toEqual('/city/:state');
    });

    it('renders the html', function () {
      expect(city.templateUrl).toEqual('app/admin/location/city/city.html');
    });

    it('uses the right controller', function () {
      expect(city.controller).toEqual('CityController as base');
    });
  });

  describe('admin.city.index', function () {
    var city;

    beforeEach(function () {
      city = $state.get('admin.city.index');
    });

    it('should not be abstract', function () {
      expect(city.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(city.url).toEqual('');
    });

    it('renders the html', function () {
      expect(city.templateUrl).toEqual('app/admin/location/city/city-index.html');
    });

    it('uses the right controller', function () {
      expect(city.controller).toEqual('CityIndexController as vm');
    });

    it('restricts to admin role', function () {
      expect(city.role).toEqual('admin');
    });
  });

  describe('admin.city.new', function () {
    var city;

    beforeEach(function () {
      city = $state.get('admin.city.new');
    });

    it('should not be abstract', function () {
      expect(city.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(city.url).toEqual('/new');
    });

    it('renders the html', function () {
      expect(city.templateUrl).toEqual('app/admin/location/city/city-new.html');
    });

    it('uses the right controller', function () {
      expect(city.controller).toEqual('CityNewController as vm');
    });

    it('restricts to admin role', function () {
      expect(city.role).toEqual('admin');
    });
  });

  describe('admin.city.edit', function () {
    var city;

    beforeEach(function () {
      city = $state.get('admin.city.edit');
    });

    it('should not be abstract', function () {
      expect(city.abstract).toBeFalsy();
    });

    it('matches a path', function () {
      expect(city.url).toEqual('/:id/edit');
    });

    it('renders the html', function () {
      expect(city.templateUrl).toEqual('app/admin/location/city/city-edit.html');
    });

    it('uses the right controller', function () {
      expect(city.controller).toEqual('CityEditController as vm');
    });

    it('restricts to admin role', function () {
      expect(city.role).toEqual('admin');
    });
  });
});
