'use strict';

describe('Form: Breed', function () {

  var form, $scope, formElement;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.vm = {breed: {}};
    $scope.base = {breedTypes: [{id: '1', label: 'type one'}, {id: '2', label: 'type two'}]};

    formElement = angular.element('<form name="form">' +
      '<ng-include src="\'app/admin/breed/breed-form.html\'"></ng-include>' +
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
      expect($scope.vm.breed.name).toEqual('some name');
    });

    it('is required', function () {
      nameElement.val('').trigger('input');
      expect(nameElement.parent().text()).toContain('Campo obrigatório');
    });
  });

  describe('type', function () {
    var typeElement;

    beforeEach(function () {
      typeElement = formElement.find('#type');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.type.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.type.$asyncValidators).length).toEqual(0);
    });

    it('shows breed types', function () {
      var options = typeElement.find('option');
      expect(options.text()).toContain('type one');
      expect(options.text()).toContain('type two');
    });

    it('has a model', function () {
      var value = typeElement.find('option[label="type one"]').attr('value');
      typeElement.val(value).change();
      expect($scope.vm.breed.type).toEqual('1');
    });

    it('is required', function () {
      typeElement.val('').change();
      expect(typeElement.parent().text()).toContain('Campo obrigatório');
    });
  });
});
