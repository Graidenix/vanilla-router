# vanilla-router

[![NPM](https://nodei.co/npm/vanilla-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vanilla-router/)

[![NPM](https://nodei.co/npm-dl/vanilla-router.png?months=1&height=3)](https://nodei.co/npm/vanilla-router/)

## Description

Simplest One Page Application Router for those who want to use it on Vanilla JS

**Note**: 
If you want to use the IE compatible version use `v1.1.5`

## Installation

#### NPM

```bashp
npm install vanilla-router --save
```

#### Bower
```bashp
bower install vanilla-router --save
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

#### mode `string` 

Default: "history" . 

- `hash` - is for hashbang routes based on `window.location.hash`
- `history` - is for clean url routes based on HTML5 functionality. It is also provide back-compatibility for old browser.


#### root `string`

Default: "/" .

Root represents the relative path for the project root.

#### page404 `function`

Default: _function_ that log an error in console.

Callback function for 404 page

#### routes `Array`
Default: [ ]

_Warning!_ Use it only if you have all stack with RegExp routes.

## Methods
Every public methods of Router return the instance of Router, so they can be chained.

#### add(path, handler, options)
Add a route and handler for this route

###### Parameters
- `path` - string | RegExp
- `handler` - callback if the URL will match the path
- `options` - object, you can specify before unload callback

string path can contain:
 - parenthesis (`( )`) - value between them is sent to callback function  
 - wildcards (`:any`, `:num`, `:word`) it doesn't pass the value to callback function
 - named placeholder (`{variableName}`) it pass the value to the callback function

```js
router.add('hello/world', function(){ });
router.add('hello/:word', function(){ });
router.add('hello/(:word)', function(name){ });
router.add('hello/{name}', function(name){ });
router.add(/^hello\/(\w+)/i, function(name){ });
```

#### remove(path)
Remove the route from current list of routes by path

#### navigateTo(path[, state[, silent]])
Navigate to the specific URI with optional additional state of page 
silent is a flag, set as true, to skip check for new URL

#### check()
Check the current URL for a change

#### back()
Simulate the browser "Back" button

#### forward()
Simulate the browser "Forward" button

#### go(step)
Go to a specific step in history

#### refresh()
Recall current route handler with same arguments

#### addUriListener()
Add the event listener for URL change 

#### removeUriListener()
Remove the event listener for URL change

#### reset()
Reset all setting and state of Router

## Licence
Released under the [MIT](https://raw.githubusercontent.com/Graidenix/vanilla-router/master/LICENSE) license

Copyright (c) 2016 Grigore Odajiu
