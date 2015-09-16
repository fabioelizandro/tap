'use strict';

describe('Controller: BreedController', function () {

  var Controller, popup, $q, breeds, resourceManager, notifier, $rootScope, Breed;

  beforeEach(module('tapApp'));

  beforeEach(function () {
    breeds = [{_id: 1, name: 'Awesome breed', info: 'test'},
      {_id: 2, name: 'Another breed', info: 'test'}];
  });

  beforeEach(inject(function ($controller, _popup_, _$q_, _resourceManager_, _notifier_, _$rootScope_, _Breed_) {
    popup = _popup_;
    $q = _$q_;
    resourceManager = _resourceManager_;
    notifier = _notifier_;
    $rootScope = _$rootScope_;
    Breed = _Breed_;

    spyOn(Breed, 'query').and.returnValue(breeds);

    Controller = $controller('BreedController');
  }));

  it('attaches a list of breeds to the vm', function () {
    $rootScope.$apply();
    expect(Controller.breeds.length).toBe(2);
    expect(Controller.breeds[0]._id).toEqual(1);
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

      Controller.destroy(Controller.breeds[0], Controller.breeds);
      $rootScope.$apply();

      expect(resourceManager.destroy).toHaveBeenCalledWith(Controller.breeds[0], Controller.breeds);
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
        Controller.destroy(Controller.breeds[0], Controller.breeds);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Raça deletada com sucesso', 'success');
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
        Controller.destroy(Controller.breeds[0], Controller.breeds);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Não foi possível deletar a raça, tente mais tarde.', 'danger');
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
        Controller.destroy(Controller.breeds[0], Controller.breeds);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
