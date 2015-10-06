'use strict';

describe('Controller: UserController', function () {

  var Controller, popup, $q, users, resourceManager, notifier, $rootScope, User;

  beforeEach(module('tapApp'));

  beforeEach(function () {
    users = [{_id: 1, name: 'Awesome user', info: 'test'},
      {_id: 2, name: 'Another user', info: 'test'}];
  });

  beforeEach(inject(function ($controller, _popup_, _$q_, _resourceManager_, _notifier_, _$rootScope_, _User_) {
    popup = _popup_;
    $q = _$q_;
    resourceManager = _resourceManager_;
    notifier = _notifier_;
    $rootScope = _$rootScope_;
    User = _User_;

    spyOn(User, 'query').and.returnValue(users);

    Controller = $controller('UserController');
  }));

  it('asks to User admin users', function () {
    expect(User.query).toHaveBeenCalledWith({role: 'admin'});
  });

  it('attaches a list of users to the vm', function () {
    $rootScope.$apply();
    expect(Controller.users.length).toBe(2);
    expect(Controller.users[0]._id).toEqual(1);
  });

  describe('#destroy', function () {
    beforeEach(function () {
      spyOn(popup, 'confirm').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#destroy with params', function () {
      spyOn(resourceManager, 'destroy').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });

      Controller.destroy(Controller.users[0], Controller.users);
      $rootScope.$apply();

      expect(resourceManager.destroy).toHaveBeenCalledWith(Controller.users[0], Controller.users);
    });

    describe('when the resource manager resolve the promise', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'destroy').and.callFake(function () {
          return $q(function (resolve) {
            return resolve();
          });
        });
      });

      it('notifies success', function () {
        Controller.destroy(Controller.users[0], Controller.users);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Usuário deletado com sucesso', 'success');
      });
    });

    describe('when the resource manager reject the promise with errors', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'destroy').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject({error: 'some error'});
          });
        });
      });

      it('notifies error', function () {
        Controller.destroy(Controller.users[0], Controller.users);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Não foi possível deletar o usuário, tente mais tarde.', 'danger');
      });
    });

    describe('when the resource manager reject the promise without errors', function () {
      beforeEach(function () {
        spyOn(resourceManager, 'destroy').and.callFake(function () {
          return $q(function (resolve, reject) {
            return reject();
          });
        });
      });

      it('does not notify', function () {
        Controller.destroy(Controller.users[0], Controller.users);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
