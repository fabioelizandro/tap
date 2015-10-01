'use strict';

describe('Controller: StateEditController', function () {

  var Controller, State, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _State_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    resourceManager = _resourceManager_;
    State = _State_;
    notifier = _notifier_;
    $state = _$state_;
    $state.params = {id: 1};

    spyOn(State, 'get').and.returnValue({_id: 1, name: 'Awesome State', info: 'test'});

    Controller = $controller('StateEditController', {$state: $state});
  }));

  it('calls the state resource with params', function () {
    expect(State.get).toHaveBeenCalledWith({id: 1});
  });

  it('attaches a state to the vm', function () {
    expect(Controller.state._id).toEqual(1);
  });

  describe('#update', function () {
    var states;

    beforeEach(function () {
      states = [{_id: 1, name: 'Awesome state', info: 'test'},
        {_id: 2, name: 'Another state', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#update with params', function () {
      spyOn(resourceManager, 'update').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.update({$valid: true, $invalid: false}, Controller.state, states);
      $rootScope.$apply();

      expect(resourceManager.update).toHaveBeenCalledWith(Controller.state, states, {$valid: true, $invalid: false});
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
        Controller.update({$valid: true, $invalid: false}, Controller.state, states);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Estado atualizado com sucesso!', 'success');
      });

      it('goes to index page', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.state, states);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.state.index');
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
        Controller.update({$valid: true, $invalid: false}, Controller.state, states);
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
        Controller.update({$valid: true, $invalid: false}, Controller.state, states);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
