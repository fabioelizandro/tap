# Todas as patas (TAP)
[![Build Status](https://travis-ci.org/fabioelizandro/tap.svg)](https://travis-ci.org/fabioelizandro/tap)
[![Dependency Status](https://david-dm.org/fabioelizandro/tap.svg)](https://david-dm.org/fabioelizandro/tap)
[![devDependency Status](https://david-dm.org/fabioelizandro/tap/dev-status.svg)](https://david-dm.org/fabioelizandro/tap#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/fabioelizandro/tap/badges/gpa.svg)](https://codeclimate.com/github/fabioelizandro/tap)
[![Test Coverage](https://codeclimate.com/github/fabioelizandro/tap/badges/coverage.svg)](https://codeclimate.com/github/fabioelizandro/tap/coverage)
[![Gitter chat](https://badges.gitter.im/fabioelizandro/tap.svg)](https://gitter.im/fabioelizandro/tap)

## Site
Heroku Link
[https://tap-app.herokuapp.com]()

## Instalação
Tenha certeza que você possui NodeJS#0.12 e MondoDB#3.0 instalados na maquina. É recomendado utilizar [nvm](https://github.com/creationix/nvm)

Instale `yo`, `grunt-cli`, `bower`, e `generator-angular-fullstack`:
```
$ npm install -g yo grunt-cli bower generator-angular-fullstack
```

Você também vai precicsar ter sass instalado. Veja como instalar no [Site Oficial](http://sass-lang.com/install)

Clone este repositório, se não for possível faça um fork para desenvolver uma nova funcionalidade.
```
$ git clone git@github.com:fabioelizandro/tap.git
```
Vá para a pasta do projeto e manda instalar as dependências
```
$ cd tap/
$ npm install 
$ bower install 
```

Pronto, agora você pode iniciar o servidor com o seguinte comando

```
$ grunt serve
```

## Desenvolvimento
O TAP utiliza o [GruntJS](http://gruntjs.com/) como taks runner, para o desenvolvimento segue as principais tarefas:

Iniciar servidor para desenvolvimento:
```
$ grunt serve
```

Iniciar Karma 
```
$ grunt test:client // Single Run e Coverage Report
$ grunt karma:dev  // Watch files para o TDD
```

Iniciar Mocha
```
$ grunt test:client // Single run
$ grunt mocha:dev   // Watch files para o TDD 
```

Iniciar servidor de produção
```
$ grunt serve:dist
```

## Deploy 
O TAP utiliza deploy contínio, a cada integração com o master o servidor de integração faz o deploy automaticamente.

O servidor de integração utilizado é [Travis](https://travis-ci.org/fabioelizandro/tap)

## A Fazer
[https://github.com/fabioelizandro/tap/issues]()
