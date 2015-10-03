'use strict';

describe('Controller: StateController', function () {

  var Controller, popup, $q, states, resourceManager, notifier, $rootScope, State;

  beforeEach(module('tapApp'));

  beforeEach(function () {
    states = [{_id: 1, name: 'Awesome state', info: 'test'},
      {_id: 2, name: 'Another state', info: 'test'}];
  });

  beforeEach(inject(function ($controller, _popup_, _$q_, _resourceManager_, _notifier_, _$rootScope_, _State_) {
    popup = _popup_;
    $q = _$q_;
    resourceManager = _resourceManager_;
    notifier = _notifier_;
    $rootScope = _$rootScope_;
    State = _State_;

    spyOn(State, 'query').and.returnValue(states);

    Controller = $controller('StateController');
  }));

  it('attaches a list of states to the vm', function () {
    $rootScope.$apply();
    expect(Controller.states.length).toBe(2);
    expect(Controller.states[0]._id).toEqual(1);
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

      Controller.destroy(Controller.states[0], Controller.states);
      $rootScope.$apply();

      expect(resourceManager.destroy).toHaveBeenCalledWith(Controller.states[0], Controller.states);
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
        Controller.destroy(Controller.states[0], Controller.states);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Estado deletado com sucesso', 'success');
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
        Controller.destroy(Controller.states[0], Controller.states);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Não foi possível deletar o estado, tente mais tarde.', 'danger');
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
        Controller.destroy(Controller.states[0], Controller.states);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
