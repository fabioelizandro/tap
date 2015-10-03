#!/usr/bin/env bash

if [ "$TRAVIS_BRANCH" = "master" ]
then
    grunt travis:deploy
fi
