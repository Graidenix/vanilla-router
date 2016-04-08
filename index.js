/* global window, module */

/**
 * Router
 *
 * @version: 0.1.1
 * @author Graidenix
 * 
 * @constructor
 *
 * @param {object} options
 * @returns {Router}
 */
function Router(options) {
    var settings = this._getSettings(options);

    this.routes = settings.routes;
    this.notFoundHandler = settings.page404;
    this.mode = (!window.history || !window.history.pushState) ? 'hash' : settings.mode;
    this.root = settings.root === '/' ? '/' : '/' + this._trimSlashes(settings.root) + '/';
    this._pageState = null;

    return this;
}

/**
 * Define Router Page
 *
 * @param {string} uri
 * @param {object} query
 * @param {Array} params
 * @param {object} state
 *
 * @constructor
 */
Router.Page = function (uri, query, params, state) {
    this.uri = uri || '';
    this.query = query || {};
    this.params = params || [];
    this.state = state || null;
};

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
    var fragment = decodeURI(window.location.pathname);
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
    var hash = window.location.hash.substr(1).replace(/(\?.*)$/, '');
    return this._trimSlashes(hash);
};

/**
 * Get current URI
 *
 * @private
 * @returns {string}
 */
Router.prototype._getFragment = function () {
    if (this.mode === 'history') {
        return this._getHistoryFragment();
    } else {
        return this._getHashFragment();
    }
};

/**
 * Trim slashes for path
 *
 * @private
 * @param {string} path
 * @returns {string}
 */
Router.prototype._trimSlashes = function (path) {
    if (typeof path !== 'string') {
        return '';
    }
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
 * Convert the string route rule to RegExp rule
 *
 * @param {string} route
 * @returns {RegExp}
 * @private
 */
Router.prototype._parseRouteRule = function (route) {
    if (typeof route !== "string") {
        return route;
    }
    var uri = this._trimSlashes(route);
    var rule = uri
        .replace(/([\\\/\-\_\.])/g, "\\$1")
        .replace(':word', '[a-zA-Z]+')
        .replace(':num', '\d+')
        .replace(':any', '[\\w\\-\\_\\.]+');

    return new RegExp('^' + rule + '$', 'i');
};

/**
 * Parse query string and return object for it
 *
 * @param {string} query
 * @returns {object}
 * @private
 */
Router.prototype._parseQuery = function (query) {
    var _query = {};
    if (typeof query !== 'string') {
        return _query;
    }

    if (query[0] === '?') {
        query = query.substr(1);
    }

    query.split('&').forEach(function (row) {
        var parts = row.split('=');
        if (parts[0] !== '') {
            if (parts[1] === undefined) {
                parts[1] = true;
            }
            _query[decodeURIComponent(parts[0])] = parts[1];
        }
    });
    return _query;
};

/**
 * Get query for `history` mode
 *
 * @returns {Object}
 * @private
 */
Router.prototype._getHistoryQuery = function () {
    return this._parseQuery(window.location.search);
};

/**
 * Get query for `hash` mode
 *
 * @returns {Object}
 * @private
 */
Router.prototype._getHashQuery = function () {
    var index = window.location.hash.indexOf('?');
    var query = (index !== -1) ? window.location.hash.substr(index) : "";
    return this._parseQuery(query);
};

/**
 * Get query as object
 *
 * @private
 * @returns {Object}
 */
Router.prototype._getQuery = function () {
    if (this.mode === 'history') {
        return this._getHistoryQuery();
    } else {
        return this._getHashQuery();
    }
};

/**
 * Add route to routes list
 *
 * @param {string|RegExp} rule
 * @param {function} handler
 * @returns {Router}
 */
Router.prototype.add = function (rule, handler) {
    this.routes.push({
        rule: this._parseRouteRule(rule),
        handler: handler
    });
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
    if (typeof param === 'string') {
        param = this._parseRouteRule(param).toString();
    }
    this.routes.some(function (route, i) {
        if (route.handler === param || route.rule.toString() === param) {
            self.routes.splice(i, 1);
            return true;
        }
        return false;
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
    this._pageState = {};
    this.removeUriListener();

    return this;
};

/**
 * Check the URL and execute handler for its route
 *
 * @returns {Router}
 */
Router.prototype.check = function () {
    var fragment = this._getFragment();
    var self = this;
    var found = this.routes.some(function (route) {
        var match = fragment.match(route.rule);
        if (match) {
            match.shift();
            var query = self._getQuery();
            var page = new Router.Page(fragment, query, match, self._pageState);
            route.handler.apply(page, match);
            self._current = btoa(window.location.href);
            self._pageState = null;
            return true;
        }
        return false;
    });

    if (!found) {
        self._current = btoa(window.location.href);
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
    this._current = btoa(window.location.href);

    window.clearInterval(this._interval);
    this._interval = setInterval(function () {
        if (self._current !== btoa(window.location.href)) {
            self.check();
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
    window.clearInterval(this._interval);
    this._current = null;
    return this;
};

/**
 * Navigate to a page
 *
 * @param {string} path
 * @param {object} state
 *
 * @returns {Router}
 */
Router.prototype.navigateTo = function (path, state) {
    path = this._trimSlashes(path) || '';
    this._pageState = state || null;
    if (this.mode === 'history') {
        history.pushState(state, null, this.root + this._trimSlashes(path));
    } else {
        window.location.hash = path;
    }
    return this.check();
};

if (typeof window !== "undefined") {
    window.Router = Router;
}

if (typeof module !== "undefined") {
    module.exports = Router;
}
