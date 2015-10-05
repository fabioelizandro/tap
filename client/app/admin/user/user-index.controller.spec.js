'use strict';

describe('Controller: UserIndexController', function () {

  var Controller;

  beforeEach(module('tapApp'));

  beforeEach(inject(function ($controller) {
    Controller = $controller('UserIndexController');
  }));

  it('is a valid controller', function () {
    expect(Controller).toBeTruthy();
  });
});
