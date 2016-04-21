# vanilla-router

Simplest One Page Application Router for those who want to use it on Vanilla JS

[![NPM](https://nodei.co/npm/vanilla-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vanilla-router/)

[![NPM](https://nodei.co/npm-dl/vanilla-router.png?months=1&height=3)](https://nodei.co/npm/vanilla-router/)

## Installation

```bashp
npm install vanilla-router
```

## Usage 

```js
var router = new Router({
    mode: 'hash',
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

