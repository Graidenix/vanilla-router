
var assert = require('chai').assert;
var Router = require('../index');

global.window = {};


describe("Router-Hash", function () {
    global.window.history = null;

    describe("default values", function () {
        var router = new Router();

        it('should return hash mode', function () {
            assert.equal('hash', router.mode);
        });

        it('should return an empty array', function () {
            assert.equal(0, router.routes.length);
        });

        it('should return `/` as default', function () {
            assert.equal('/', router.root);
        });

        it('should return a callback for notFound', function () {
            assert.isFunction(router.notFoundHandler);
        });
    });

    describe("init values", function () {
        it('should return hash mode even for history settings', function () {
            var router = new Router({
                mode: 'history'
            });
            assert.equal('hash', router.mode);
        });
        
        it('should return hash mode even for hash settings', function () {
            var router = new Router({
                mode: 'hash'
            });
            assert.equal('hash', router.mode);
        });
    });
});