'use strict';

describe('Controller: CityController', function () {

  var Controller, popup, $q, cities, resourceManager, notifier, $rootScope, City;

  beforeEach(module('tapApp'));

  beforeEach(function () {
    cities = [{_id: 1, name: 'Awesome city', info: 'test'},
      {_id: 2, name: 'Another city', info: 'test'}];
  });

  beforeEach(inject(function ($controller, _popup_, _$q_, _resourceManager_, _notifier_, _$rootScope_, _City_, State) {
    popup = _popup_;
    $q = _$q_;
    resourceManager = _resourceManager_;
    notifier = _notifier_;
    $rootScope = _$rootScope_;
    City = _City_;

    spyOn(State, 'get').and.returnValue({_id: 1, name: 'State'});
    spyOn(City, 'query').and.returnValue(cities);

    Controller = $controller('CityController');
  }));

  it('attaches a list of cities to the vm', function () {
    $rootScope.$apply();
    expect(Controller.cities.length).toBe(2);
    expect(Controller.cities[0]._id).toEqual(1);
  });

  it('attaches a state to the vm', function () {
    $rootScope.$apply();
    expect(Controller.state._id).toBe(1);
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

      Controller.destroy(Controller.cities[0], Controller.cities);
      $rootScope.$apply();

      expect(resourceManager.destroy).toHaveBeenCalledWith(Controller.cities[0], Controller.cities);
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
        Controller.destroy(Controller.cities[0], Controller.cities);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Cidade deletada com sucesso', 'success');
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
        Controller.destroy(Controller.cities[0], Controller.cities);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Não foi possível deletar a cidade, tente mais tarde.', 'danger');
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
        Controller.destroy(Controller.cities[0], Controller.cities);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
