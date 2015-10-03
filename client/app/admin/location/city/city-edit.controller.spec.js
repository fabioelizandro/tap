'use strict';

describe('Controller: CityEditController', function () {

  var Controller, City, notifier, $state, $rootScope, resourceManager, $q;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller, _City_, _notifier_, _$state_, _$rootScope_, _resourceManager_, _$q_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
    resourceManager = _resourceManager_;
    City = _City_;
    notifier = _notifier_;
    $state = _$state_;
    $state.params = {id: 1};

    spyOn(City, 'get').and.returnValue({_id: 1, name: 'Awesome City', info: 'test'});

    Controller = $controller('CityEditController', {$state: $state});
  }));

  it('calls the city resource with params', function () {
    expect(City.get).toHaveBeenCalledWith({id: 1});
  });

  it('attaches a city to the vm', function () {
    expect(Controller.city._id).toEqual(1);
  });

  describe('#update', function () {
    var cities;

    beforeEach(function () {
      cities = [{_id: 1, name: 'Awesome city', info: 'test'},
        {_id: 2, name: 'Another city', info: 'test'}];

      spyOn(notifier, 'notify');
    });

    it('calls the resourceManager#update with params', function () {
      spyOn(resourceManager, 'update').and.callFake(function () {
        return $q(function (resolve) {
          resolve();
        });
      });
      Controller.update({$valid: true, $invalid: false}, Controller.city, cities);
      $rootScope.$apply();

      expect(resourceManager.update).toHaveBeenCalledWith(Controller.city, cities, {$valid: true, $invalid: false});
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
        Controller.update({$valid: true, $invalid: false}, Controller.city, cities);
        $rootScope.$apply();

        expect(notifier.notify).toHaveBeenCalledWith('Cidade atualizada com sucesso!', 'success');
      });

      it('goes to index page', function () {
        Controller.update({$valid: true, $invalid: false}, Controller.city, cities);
        $rootScope.$apply();

        expect($state.go).toHaveBeenCalledWith('admin.city.index');
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
        Controller.update({$valid: true, $invalid: false}, Controller.city, cities);
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
        Controller.update({$valid: true, $invalid: false}, Controller.city, cities);
        $rootScope.$apply();

        expect(notifier.notify).not.toHaveBeenCalled();
      });
    });
  });
});
