'use strict';

describe('Controller: UserNewController', function () {

  var Controller, User, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _User_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    User = _User_;
    notifier = _notifier_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    resourceManager = _resourceManager_;

    Controller = $controller('UserNewController');
  }));

  it('attaches a new user to the vm', function () {
    expect(Controller.user).toEqual(new User({role: 'admin'}));
  });

  describe('#create', function () {
    var users;

    beforeEach(function () {
      users = [{_id: 1, name: 'Awesome user', info: 'test'},
        {_id: 2, name: 'Another user', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#create with params', function () {
      spyOn(resourceManager, 'create').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.create({$valid: true, $invalid: false}, Controller.user, users);
      $rootScope.$apply();

      expect(resourceManager.create).toHaveBeenCalledWith(Controller.user, users, {$valid: true, $invalid: false});
    });

    describe('when the resource manager resolve the promise', function () {
      beforeEach(function () {
        spyOn($state, 'go');
        spyOn(resourceManager, 'create').and.callFake(function () {
          return $q(function (resolve) {
            resolve();
          });
        });
      });

      it('notifies the success', function () {
        Controller.create({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Usuário cadastrado com sucesso!', 'success');
      });

      it('goes to the index page', function () {
        Controller.create({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.user.index');
      });
    });

    describe('when the resource manager reject the promise without errors', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'create').and.callFake(function () {
          return $q(function (resolve, reject) {
            reject();
          });
        });
      });

      it('does not notify', function () {
        Controller.create({$valid: false, $invalid: true}, Controller.user, users);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });

    describe('when the resource manager reject the promise with errors', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'create').and.callFake(function () {
          return $q(function (resolve, reject) {
            reject({error: 'some error'});
          });
        });
      });

      it('notifies the error', function () {
        Controller.create({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Algum erro ocorreu!', 'danger');
      });
    });
  });
});
