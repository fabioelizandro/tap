'use strict';

describe('Controller: CityIndexController', function () {

  var Controller;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller) {
    Controller = $controller('CityIndexController');
  }));

  it('is a valid controller', function () {
    expect(Controller).toBeTruthy();
  });
});
