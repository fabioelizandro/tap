'use strict';

describe('Controller: StateIndexController', function () {

  var Controller;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller) {
    Controller = $controller('StateIndexController');
  }));

  it('is a valid controller', function () {
    expect(Controller).toBeTruthy();
  });
});
