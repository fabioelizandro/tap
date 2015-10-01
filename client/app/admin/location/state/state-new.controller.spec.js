'use strict';

describe('Controller: StateNewController', function () {

  var Controller, State, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _State_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    State = _State_;
    notifier = _notifier_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    resourceManager = _resourceManager_;

    Controller = $controller('StateNewController');
  }));

  it('attaches a new state to the vm', function () {
    expect(Controller.state).toEqual(new State());
  });

  describe('#create', function () {
    var states;

    beforeEach(function () {
      states = [{_id: 1, name: 'Awesome state', info: 'test'},
        {_id: 2, name: 'Another state', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#create with params', function () {
      spyOn(resourceManager, 'create').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.create({$valid: true, $invalid: false}, Controller.state, states);
      $rootScope.$apply();

      expect(resourceManager.create).toHaveBeenCalledWith(Controller.state, states, {$valid: true, $invalid: false});
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
        Controller.create({$valid: true, $invalid: false}, Controller.state, states);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Estado cadastrado com sucesso!', 'success');
      });

      it('goes to the index page', function () {
        Controller.create({$valid: true, $invalid: false}, Controller.state, states);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.state.index');
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
        Controller.create({$valid: false, $invalid: true}, Controller.state, states);
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
        Controller.create({$valid: true, $invalid: false}, Controller.state, states);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Algum erro ocorreu!', 'danger');
      });
    });
  });
});
