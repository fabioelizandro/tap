'use strict';

describe('Form: State', function () {

  var form, $scope, formElement;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.vm = {state: {}};

    formElement = angular.element('<form name="form" novalidate>' +
      '<ng-include src="\'app/admin/location/state/state-form.html\'"></ng-include>' +
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
      expect($scope.vm.state.name).toEqual('some name');
    });

    it('is required', function () {
      nameElement.val('').trigger('input');
      expect(nameElement.parent().text()).toContain('Campo obrigatório');
    });
  });

  describe('acronym', function () {
    var acronymElement;

    beforeEach(function () {
      acronymElement = formElement.find('#acronym');
    });

    it('has two sync validator', function () {
      expect(Object.keys(form.acronym.$validators).length).toEqual(2);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.acronym.$asyncValidators).length).toEqual(0);
    });

    it('has model', function () {
      acronymElement.val('uf').trigger('input');
      expect($scope.vm.state.acronym).toEqual('uf');
    });

    it('is required', function () {
      acronymElement.val('').trigger('input');
      expect(acronymElement.parent().text()).toContain('Campo obrigatório');
    });

    it('does not use values greater than 2', function () {
      acronymElement.val('abc').trigger('input');
      expect($scope.vm.state.acronym).toBeUndefined();
    });
  });

  describe('published', function () {
    var publishedElement;

    beforeEach(function () {
      publishedElement = formElement.find('#published');
    });

    it('has no sync validator', function () {
      expect(Object.keys(form.published.$validators).length).toEqual(0);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.published.$asyncValidators).length).toEqual(0);
    });

    it('has model', function () {
      publishedElement.prop('checked', 'checked').trigger('click');
      expect($scope.vm.state.published).toBeTruthy();
    });
  });
});
