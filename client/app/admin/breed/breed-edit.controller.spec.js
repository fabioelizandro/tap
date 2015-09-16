'use strict';

describe('Controller: BreedEditController', function () {

  var Controller, Breed, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _Breed_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    resourceManager = _resourceManager_;
    Breed = _Breed_;
    notifier = _notifier_;
    $state = _$state_;
    $state.params = {id: 1};

    spyOn(Breed, 'get').and.returnValue({_id: 1, name: 'Awesome Breed', info: 'test'});

    Controller = $controller('BreedEditController', {$state: $state});
  }));

  it('calls the breed resource with params', function () {
    expect(Breed.get).toHaveBeenCalledWith({id: 1});
  });

  it('attaches a breed to the vm', function () {
    expect(Controller.breed._id).toEqual(1);
  });

  describe('#update', function () {
    var breeds;

    beforeEach(function () {
      breeds = [{_id: 1, name: 'Awesome breed', info: 'test'},
        {_id: 2, name: 'Another breed', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#update with params', function () {
      spyOn(resourceManager, 'update').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.update({$valid: true, $invalid: false}, Controller.breed, breeds);
      $rootScope.$apply();

      expect(resourceManager.update).toHaveBeenCalledWith(Controller.breed, breeds, {$valid: true, $invalid: false});
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
        Controller.update({$valid: true, $invalid: false}, Controller.breed, breeds);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Raça cadastrada com sucesso!', 'success');
      });

      it('goes to index page', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.breed, breeds);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.breed.index');
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
        Controller.update({$valid: true, $invalid: false}, Controller.breed, breeds);
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
        Controller.update({$valid: true, $invalid: false}, Controller.breed, breeds);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
