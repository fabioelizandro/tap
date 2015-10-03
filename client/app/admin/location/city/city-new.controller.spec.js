'use strict';

describe('Controller: CityNewController', function () {

  var Controller, City, notifier, $state, $rootScope, resourceManager, $q, state;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _City_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    City = _City_;
    notifier = _notifier_;
    $state = _$state_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    resourceManager = _resourceManager_;
    state = {_id: 1, name: 'Some State'};

    Controller = $controller('CityNewController');
  }));

  it('attaches a new city to the vm', function () {
    expect(Controller.city).toEqual(new City());
  });

  describe('#create', function () {
    var cities;

    beforeEach(function () {
      cities = [{_id: 1, name: 'Awesome city', info: 'test'},
        {_id: 2, name: 'Another city', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('sets state id in the city', function () {
      spyOn(resourceManager, 'create').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });

      Controller.city.state = null;
      Controller.create({$valid: true, $invalid: false}, state, Controller.city, cities);
      $rootScope.$apply();

      expect(Controller.city.state).toEqual(1);
    });

    it('calls the resourceManager#create with params', function () {
      spyOn(resourceManager, 'create').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.create({$valid: true, $invalid: false}, state, Controller.city, cities);
      $rootScope.$apply();

      expect(resourceManager.create).toHaveBeenCalledWith(Controller.city, cities, {$valid: true, $invalid: false});
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
        Controller.create({$valid: true, $invalid: false}, state, Controller.city, cities);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Cidade cadastrada com sucesso!', 'success');
      });

      it('goes to the index page', function () {
        Controller.create({$valid: true, $invalid: false}, state, Controller.city, cities);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.city.index');
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
        Controller.create({$valid: false, $invalid: true}, state, Controller.city, cities);
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
        Controller.create({$valid: true, $invalid: false}, state, Controller.city, cities);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Algum erro ocorreu!', 'danger');
      });
    });
  });
});
