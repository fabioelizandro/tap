'use strict';

describe('Controller: BreedNewController', function () {

  var Controller, Breed, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _Breed_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    Breed = _Breed_;
    notifier = _notifier_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    resourceManager = _resourceManager_;

    Controller = $controller('BreedNewController');
  }));

  it('attaches a new breed to the vm', function () {
    expect(Controller.breed).toEqual(new Breed());
  });

  describe('#create', function () {
    var breeds;

    beforeEach(function () {
      breeds = [{_id: 1, name: 'Awesome breed', info: 'test'},
        {_id: 2, name: 'Another breed', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#create with params', function () {
      spyOn(resourceManager, 'create').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.create({$valid: true, $invalid: false}, Controller.breed, breeds);
      $rootScope.$apply();

      expect(resourceManager.create).toHaveBeenCalledWith(Controller.breed, breeds, {$valid: true, $invalid: false});
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
        Controller.create({$valid: true, $invalid: false}, Controller.breed, breeds);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Raça cadastrada com sucesso!', 'success');
      });

      it('goes to the index page', function () {
        Controller.create({$valid: true, $invalid: false}, Controller.breed, breeds);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.breed.index');
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
        Controller.create({$valid: false, $invalid: true}, Controller.breed, breeds);
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
        Controller.create({$valid: true, $invalid: false}, Controller.breed, breeds);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Algum erro ocorreu!', 'danger');
      });
    });
  });
});
