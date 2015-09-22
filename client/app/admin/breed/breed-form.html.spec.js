'use strict';

describe('Form: Breed', function () {

  var form;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($rootScope, $compile) {
    var $scope = $rootScope.$new();
    var element = angular.element('<form name="form">' +
      '<ng-include src="\'app/admin/breed/breed-form.html\'"></ng-include>' +
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
      expect(form.name.$validators.required).not.toBeUndefined();
    });
  });

  describe('type', function () {
    it('is named type', function () {
      expect(form.type.$name).toEqual('type');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.type.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.type.$asyncValidators).length).toEqual(0);
    });

    it('is required', function () {
      expect(form.type.$validators.required).not.toBeUndefined();
    });
  });
});
