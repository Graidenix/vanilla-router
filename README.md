# vanilla-router

Simplest One Page Application Router for those who want to use it on Vanilla JS

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

router.add(/^\/?$/, function () {
    console.log('Home page');
});

router.add(/^hello\/([a-z]+)$/i, function (name) {
    console.log('Hello, ' + name);
});

router.add('about', function () {
    console.log('About Page');
});

router.addUriListener();

router.navigateTo('hello/World');
```