'use strict';

describe('Form: Thing', function () {

  var form, $scope, formElement;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.vm = {thing: {}};

    formElement = angular.element('<form name="form">' +
      '<ng-include src="\'app/admin/thing/thing-form.html\'"></ng-include>' +
      '</form>');

    $compile(formElement)($scope);
    $scope.$apply();

    form = $scope.form;
  }));

  describe('name', function () {
    var nameElement;

    beforeEach(function () {
      nameElement = formElement.find('#name');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.name.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.name.$asyncValidators).length).toEqual(0);
    });

    it('has a model', function () {
      nameElement.val('some name').trigger('input');
      expect($scope.vm.thing.name).toEqual('some name');
    });

    it('is required', function () {
      nameElement.val('').trigger('input');
      expect(nameElement.parent().text()).toContain('Campo obrigatório');
    });
  });

  describe('info', function () {
    var infoElement;

    beforeEach(function () {
      infoElement = formElement.find('#info');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.info.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.info.$asyncValidators).length).toEqual(0);
    });

    it('has a model', function () {
      infoElement.val('some info').trigger('input');
      expect($scope.vm.thing.info).toEqual('some info');
    });

    it('is required', function () {
      infoElement.val('').trigger('input');
      expect(infoElement.parent().text()).toContain('Campo obrigatório');
    });
  });
});
