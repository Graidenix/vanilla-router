# vanilla-router

[![NPM](https://nodei.co/npm/vanilla-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vanilla-router/)

[![NPM](https://nodei.co/npm-dl/vanilla-router.png?months=1&height=3)](https://nodei.co/npm/vanilla-router/)

## Description

Simplest One Page Application Router for those who want to use it on Vanilla JS


## Installation

```bashp
npm install vanilla-router --save
```

## Usage 

```js
var router = new Router({
    mode: 'history',
    page404: function (path) {
        console.log('"/' + path + '" Page not found');
    }
});

router.add('', function () {
    console.log('Home page');
});

router.add('hello/(:any)', function (name) {
    console.log('Hello, ' + name);
});

router.add('about', function () {
    console.log('About Page');
});

router.addUriListener();

router.navigateTo('hello/World');
```

## Options

### mode `string`

### root `string`

### page404 `function`

### routes `Array`   

## Methods

### add(path, handler)

### remove(path)

### navigateTo(path, [state])

### check()

### back()

### forward()

### go(step)

### addUriListener()

### removeUriListener()

### reset()

## Licence
Released under the MIT license
Copyright (c) 2016 Grigore Odajiu - 
