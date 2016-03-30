/* global window, history */

/**
 * Router
 * @constructor
 *
 * @param {object} options
 * @returns {Router}
 */
function Router(options) {
    var settings = this._getSettings(options);

    this.routes = settings.routes;
    this.notFoundHandler = settings.page404;
    this.mode = (!history.pushState) ? 'hash' : settings.mode;
    this.root = settings.root === '/' ? '/' : '/' + this._trimSlashes(settings.root) + '/';

    return this;
}

/**
 * Sanitize options and add default values
 *
 * @param {object} options
 * @returns {object}
 * @private
 */
Router.prototype._getSettings = function (options) {
    var settings = {};
    var defaults = {
        routes: [],
        mode: 'history',
        root: '/',
        page404: function (page) {
            console.error({
                page: page,
                message: '404. Page not found'
            });
        }
    };

    options = options || {};
    ['routes', 'mode', 'root', 'page404'].forEach(function (key) {
        settings[key] = options[key] || defaults[key];
    });

    return settings;

};

/**
 * Get URI for Router 'history' mode
 *
 * @private
 * @returns {string}
 */
Router.prototype._getHistoryFragment = function () {
    var uri = decodeURI(location.pathname + location.search);
    var fragment = this._trimSlashes(uri).replace(/\?(.*)$/, '');
    if (this.root !== '/') {
        fragment = fragment.replace(this.root, '');
    }
    return this._trimSlashes(fragment);
};

/**
 * Get URI for router 'hash' mode
 *
 * @private
 * @returns {string}
 */
Router.prototype._getHashFragment = function () {
    return this._trimSlashes(window.location.hash.substr(1));
};

/**
 * Trim slashes for path
 *
 * @private
 * @param {string} path
 * @returns {string}
 */
Router.prototype._trimSlashes = function (path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
};

/**
 * 404 Page Handler
 *
 * @private
 */
Router.prototype._page404 = function (path) {
    this.notFoundHandler(path);
};

/**
 * Get current URI
 *
 * @private
 * @returns {string}
 */
Router.prototype._getFragment = function () {
    if (this.mode === 'history') {
        return this._trimSlashes(this._getHistoryFragment());
    }

    return this._getHashFragment();
};

/**
 * Add route to routes list
 *
 * @param route
 * @param handler
 * @returns {Router}
 */
Router.prototype.add = function (route, handler) {
    if (typeof route == 'function') {
        handler = route;
        route = '';
    }
    if (typeof route === "string") {
        route = this._trimSlashes(route);
    }

    this.routes.push({route: route, handler: handler});
    return this;
};

/**
 * Remove a route from routes list
 *
 * @param param
 * @returns {Router}
 */
Router.prototype.remove = function (param) {
    var self = this;
    this.routes.some(function (route) {
        if (route.handler === param || route.route.toString() === param.toString()) {
            self.routes.splice(i, 1);
            return false;
        }
        return true;
    });

    return this;
};

/**
 * Reset the state of Router
 *
 * @returns {Router}
 */
Router.prototype.reset = function () {
    this.routes = [];
    this.mode = null;
    this.root = '/';
    this.disconnect();

    return this;
};

/**
 * Check the URL and execute handler for its route
 *
 * @param {string} fragment
 * @returns {Router}
 */
Router.prototype.check = function (fragment) {
    fragment = this._trimSlashes(fragment) || this._getFragment();
    var self = this;
    var found = this.routes.some(function (route) {
        var match = fragment.match(route.route);
        if (match) {
            match.shift();
            route.handler.apply({}, match);
            self._current = fragment;
            return true;
        }
        return false;
    });

    if (!found) {
        self._current = fragment;
        this._page404(fragment);
    }

    return this;
};

/**
 * Add the URI listener
 *
 * @returns {Router}
 */
Router.prototype.addUriListener = function () {
    var self = this;
    this._current = self._getFragment();

    window.clearInterval(this.interval);
    this.interval = setInterval(function () {
        if (self._current !== self._getFragment()) {
            self.check(self._getFragment());
        }
    }, 100);
    return this;
};

/**
 * Remove the URI listener
 *
 * @returns {Router}
 */
Router.prototype.removeUriListener = function () {
    window.clearInterval(this.interval);
    this._current = null;
    return this;
};

/**
 * Navigate to a page
 *
 * @param {string} path
 * @returns {Router}
 */
Router.prototype.navigateTo = function (path) {
    path = this._trimSlashes(path) || '';
    if (this.mode === 'history') {
        history.pushState(null, null, this.root + this._trimSlashes(path));
    } else {
        window.location.hash = path;
    }

    this.check(path);
    return this;
};

if (module && module.exports) {
    module.exports = Router;
}
if (window) {
    window.Router = Router;
}
