'use strict';

describe('Form: Thing', function () {

  var form;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($rootScope, $compile) {
    var $scope = $rootScope.$new();
    var element = angular.element('<form name="form">' +
      '<ng-include src="\'app/admin/thing/thing-form.html\'"></ng-include>' +
      '</form>');

    $compile(element)($scope);
    $scope.$apply();

    form = $scope.form;
  }));

  describe('name', function () {
    it('is named name', function () {
      expect(form.name.$name).toEqual('name');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.name.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.name.$asyncValidators).length).toEqual(0);
    });

    it('is required', function () {
      expect(form.name.$validators.required).toBeDefined();
    });
  });

  describe('info', function () {
    it('is named info', function () {
      expect(form.info.$name).toEqual('info');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.info.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.info.$asyncValidators).length).toEqual(0);
    });

    it('is required', function () {
      expect(form.info.$validators.required).toBeDefined();
    });
  });
});
