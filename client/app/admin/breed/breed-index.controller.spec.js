'use strict';

describe('Controller: BreedIndexController', function () {

  var Controller;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller) {
    Controller = $controller('BreedIndexController');
  }));

  it('is a valid controller', function () {
    expect(Controller).toBeTruthy();
  });
});
