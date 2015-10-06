'use strict';

describe('Form: User', function () {

  var form, $scope, formElement;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($rootScope, $compile) {
    $scope = $rootScope.$new();
    $scope.vm = {user: {}};

    formElement = angular.element('<form name="form">' +
      '<ng-include src="\'app/admin/user/user-form.html\'"></ng-include>' +
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
      expect($scope.vm.user.name).toEqual('some name');
    });

    it('is required', function () {
      nameElement.val('').trigger('input');
      expect(nameElement.parent().text()).toContain('Campo obrigatório');
    });
  });

  describe('email', function () {
    var emailElement;

    beforeEach(function () {
      emailElement = formElement.find('#email');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.email.$validators).length).toEqual(2);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.email.$asyncValidators).length).toEqual(0);
    });

    it('has a model', function () {
      emailElement.val('joe@example.com').trigger('input');
      expect($scope.vm.user.email).toEqual('joe@example.com');
    });

    it('is required', function () {
      emailElement.val('').trigger('input');
      expect(emailElement.parent().text()).toContain('Campo obrigatório');
    });

    it('rejects invalid email', function () {
      emailElement.val('some invalid email').trigger('input');
      expect(emailElement.parent().text()).toContain('Este não é um e-mail válido');
    });
  });

  describe('password', function () {
    var passwordElement;

    beforeEach(function () {
      passwordElement = formElement.find('#password');
    });

    it('has one sync validator', function () {
      expect(Object.keys(form.password.$validators).length).toEqual(1);
    });

    it('has no async validators', function () {
      expect(Object.keys(form.password.$asyncValidators).length).toEqual(0);
    });

    it('has a model', function () {
      passwordElement.val('some password').trigger('input');
      expect($scope.vm.user.password).toEqual('some password');
    });

    it('is required', function () {
      passwordElement.val('').trigger('input');
      expect(passwordElement.parent().text()).toContain('Campo obrigatório');
    });

    describe('when user does not has id', function () {
      it('showing', function () {
        $scope.vm.user._id = null;
        $scope.$apply();
        expect(formElement.find('#password').length).toBeTruthy();
      });
    });

    describe('when user has id', function () {
      it('is hidden', function () {
        $scope.vm.user._id = 1;
        $scope.$apply();
        expect(formElement.find('#password').length).toBeFalsy();
      });
    });
  });
});
