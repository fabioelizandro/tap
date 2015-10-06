'use strict';

describe('Controller: UserEditController', function () {

  var Controller, User, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _User_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    resourceManager = _resourceManager_;
    User = _User_;
    notifier = _notifier_;
    $state = _$state_;
    $state.params = {id: 1};

    spyOn(User, 'get').and.returnValue({_id: 1, name: 'Awesome User', info: 'test'});

    Controller = $controller('UserEditController', {$state: $state});
  }));

  it('calls the user resource with params', function () {
    expect(User.get).toHaveBeenCalledWith({id: 1});
  });

  it('attaches a user to the vm', function () {
    expect(Controller.user._id).toEqual(1);
  });

  describe('#update', function () {
    var users;

    beforeEach(function () {
      users = [{_id: 1, name: 'Awesome user', info: 'test'},
        {_id: 2, name: 'Another user', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#update with params', function () {
      spyOn(resourceManager, 'update').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.update({$valid: true, $invalid: false}, Controller.user, users);
      $rootScope.$apply();

      expect(resourceManager.update).toHaveBeenCalledWith(Controller.user, users, {$valid: true, $invalid: false});
    });

    describe('when resource manager resolve the promise', function () {
      beforeEach(function () {
        spyOn($state, 'go');
        spyOn(resourceManager, 'update').and.callFake(function () {
          return $q(function (resolve) {
            resolve();
          });
        });
      });

      it('notifies the success', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Usuário atualizado com sucesso!', 'success');
      });

      it('goes to index page', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.user.index');
      });
    });

    describe('when the resource manager reject the promise with errors', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'update').and.callFake(function () {
          return $q(function (resolve, reject) {
            reject({error: 'some error'});
          });
        });
      });

      it('notifies the error', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Algum erro ocorreu ao atualizar', 'error');
      });
    });

    describe('when the resource manager reject the promise without error', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'update').and.callFake(function () {
          return $q(function (resolve, reject) {
            reject();
          });
        });
      });

      it('does not notify', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.user, users);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
