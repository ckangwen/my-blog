(function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function isNative(Ctor) {
        return typeof Ctor === 'function' && /native code/.test(Ctor.toString());
    }

    var emptyObject = Object.freeze({});
    var inBrowser = typeof window !== 'undefined';
    var hasSymbol = typeof Symbol !== 'undefined' && isNative(Symbol) &&
        typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

    function clone(value) {
        if (Array.isArray(value)) {
            return value.map(clone);
        }
        else if (value && typeof value === 'object') {
            var res = {};
            for (var key in value) {
                res[key] = clone(value[key]);
            }
            return res;
        }
        else {
            return value;
        }
    }
    function warn(message) {
        {
            typeof console !== 'undefined' && console.warn("[vue-router] " + message);
        }
    }
    function extend(a, b) {
        for (var key in b) {
            a[key] = b[key];
        }
        return a;
    }

    var encodeReserveRE = /[!'()*]/g;
    var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
    var commaRE = /%2C/g;
    // fixed encodeURIComponent which is more conformant to RFC3986:
    // - escapes [!'()*]
    // - preserve commas
    var encode = function (str) {
        return encodeURIComponent(str)
            .replace(encodeReserveRE, encodeReserveReplacer)
            .replace(commaRE, ',');
    };
    var decode = decodeURIComponent;
    function stringifyQuery(obj) {
        var res = obj
            ? Object.keys(obj)
                .map(function (key) {
                var val = obj[key];
                if (val === undefined) {
                    return '';
                }
                if (val === null) {
                    return encode(key);
                }
                if (Array.isArray(val)) {
                    var result_1 = [];
                    val.forEach(function (val2) {
                        if (val2 === undefined) {
                            return;
                        }
                        if (val2 === null) {
                            result_1.push(encode(key));
                        }
                        else {
                            result_1.push(encode(key) + '=' + encode(val2));
                        }
                    });
                    return result_1.join('&');
                }
                return encode(key) + '=' + encode(val);
            })
                .filter(function (x) { return x.length > 0; })
                .join('&')
            : null;
        return res ? "?" + res : '';
    }
    function parseQuery(query) {
        var res = {};
        query = query.trim().replace(/^(\?|#|&)/, '');
        if (!query) {
            return res;
        }
        query.split('&').forEach(function (param) {
            var parts = param.replace(/\+/g, ' ').split('=');
            var key = decode(parts.shift());
            var val = parts.length > 0 ? decode(parts.join('=')) : null;
            if (res[key] === undefined) {
                res[key] = val;
            }
            else if (Array.isArray(res[key])) {
                res[key].push(val);
            }
            else {
                res[key] = [res[key], val];
            }
        });
        return res;
    }
    var castQueryParamValue = function (value) { return (value == null || typeof value === 'object' ? value : String(value)); };
    function resolveQuery(query, extraQuery, _parseQuery) {
        if (extraQuery === void 0) { extraQuery = {}; }
        var parse = _parseQuery || parseQuery;
        var parsedQuery;
        try {
            parsedQuery = parse(query || '');
        }
        catch (e) {
             warn(e.message);
            parsedQuery = {};
        }
        for (var key in extraQuery) {
            var value = extraQuery[key];
            parsedQuery[key] = Array.isArray(value)
                ? value.map(castQueryParamValue)
                : castQueryParamValue(value);
        }
        return parsedQuery;
    }

    function createRoute(record, location, redirectedFrom, router) {
        var stringifyQuery$1 = router && router.options.stringifyQuery || stringifyQuery;
        var query = location.query || {};
        try {
            query = clone(query);
        }
        catch (e) { }
        var route = {
            name: location.name || (record && record.name),
            meta: (record && record.meta) || {},
            path: location.path || '/',
            hash: location.hash || '',
            query: query,
            params: location.params || {},
            fullPath: getFullPath(location, stringifyQuery$1),
            matched: record ? formatMatch(record) : []
        };
        if (redirectedFrom) {
            route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$1);
        }
        return Object.freeze(route);
    }
    var START = createRoute(null, {
        path: '/'
    });
    function getFullPath(location, stringifyQuery) {
        return (location.path || '/') + stringifyQuery(location.query) + location.hash;
    }
    function formatMatch(record) {
        var res = [];
        while (record) {
            res.unshift(record);
            record = record.parent;
        }
        return res;
    }

    function resolveAsyncComponents(matched) {
        return function (to, from, next) {
            next();
        };
    }

    function runQueue(queue, fn, cb) {
        var step = function (index) {
            if (index >= queue.length) {
                cb();
            }
            else {
                if (queue[index]) {
                    fn(queue[index], function () {
                        step(index + 1);
                    });
                }
                else {
                    step(index + 1);
                }
            }
        };
        step(0);
    }

    var NavigationFailureType = {
        redirected: 2,
        aborted: 4,
        cancelled: 8,
        duplicated: 16
    };
    function isError(err) {
        return Object.prototype.toString.call(err).indexOf('Error') > -1;
    }
    function createRouterError(from, to, type, message) {
        var error = new Error(message);
        error._isRouter = true;
        error.from = from;
        error.to = to;
        error.type = type;
        return error;
    }
    function createNavigationRedirectedError(from, to) {
        return createRouterError(from, to, NavigationFailureType.redirected, "Redirected when going from \"" + from.fullPath + "\" to \"" + stringifyRoute(to) + "\" via a navigation guard.");
    }
    var propertiesToLog = ['params', 'query', 'hash'];
    function stringifyRoute(to) {
        if (typeof to === 'string')
            return to;
        if ('path' in to)
            return to.path;
        var location = {};
        propertiesToLog.forEach(function (key) {
            if (key in to)
                location[key] = to[key];
        });
        return JSON.stringify(location, null, 2);
    }

    var History = /** @class */ (function () {
        // push (loc: RawLocation, onComplete?: Function, onAbort?: Function) => void
        // replace: (
        //   loc: RawLocation,
        //   onComplete?: Function,
        //   onAbort?: Function
        // ) => void
        // ensureURL: (push?: boolean) => void
        function History(router, base) {
            this.router = router;
            this.base = normalizeBase(base);
            this.current = START;
            this.pending = null;
            this.ready = false;
            this.readyCbs = [];
            this.readyErrorCbs = [];
            this.errorCbs = [];
            this.listeners = [];
        }
        History.prototype.setupListeners = function () { };
        History.prototype.getCurrentLocation = function () { };
        History.prototype.go = function (n) { };
        History.prototype.push = function (loc, onComplete, onAbort) { };
        History.prototype.replace = function (loc, onComplete, onAbort) { };
        History.prototype.ensureURL = function (push) { };
        History.prototype.listen = function (cb) {
            this.cb = cb;
        };
        History.prototype.onReady = function (cb, errorCb) {
            if (this.ready) {
                cb();
            }
            else {
                this.readyCbs.push(cb);
                if (errorCb) {
                    this.readyErrorCbs.push(errorCb);
                }
            }
        };
        History.prototype.onError = function (errorCb) {
            this.errorCbs.push(errorCb);
        };
        History.prototype.transitionTo = function (location, onComplete, onAbort) {
            var _this = this;
            var route = this.router.match(location, this.current);
            var prev = this.current;
            this.confirmTransition(route, function () {
                _this.updateRoute(route);
                onComplete && onComplete(route);
                _this.ensureURL();
                _this.router.afterHooks.forEach(function (hook) {
                    hook && hook(route, prev);
                });
                // fire ready cbs once
                if (!_this.ready) {
                    _this.ready = true;
                    _this.readyCbs.forEach(function (cb) {
                        cb(route);
                    });
                }
            }, function (err) {
                if (onAbort) {
                    onAbort(err);
                }
            });
        };
        History.prototype.confirmTransition = function (route, onComplete, onAbort) {
            var _this = this;
            var current = this.current;
            this.pending = route;
            var abort = function (err) {
                onAbort && onAbort(err);
            };
            var _a = resolveQueue(this.current.matched, route.matched);
            var queue = [].concat(resolveAsyncComponents());
            var iterator = function (hook, next) {
                try {
                    // to from next
                    hook(route, current, function (to) {
                        if (to === false) {
                            // next(false) -> abort navigation, ensure current URL
                            _this.ensureURL(true);
                            console.log('abort navigation');
                            // abort(createNavigationAbortedError(current, route))
                        }
                        else if (isError(to)) {
                            _this.ensureURL(true);
                            abort(to);
                        }
                        else if (typeof to === 'string' ||
                            (typeof to === 'object' &&
                                (typeof to.path === 'string' || typeof to.name === 'string'))) {
                            // next('/') or next({ path: '/' }) -> redirect
                            abort(createNavigationRedirectedError(current, route));
                            if (typeof to === 'object' && to.replace) {
                                _this.replace(to);
                            }
                            else {
                                _this.push(to);
                            }
                        }
                        else {
                            // confirm transition and pass on the value
                            next(to);
                        }
                    });
                }
                catch (e) {
                    abort(e);
                }
            };
            runQueue(queue, iterator, function () {
                var queue = [].concat(_this.router.resolveHooks);
                runQueue(queue, iterator, function () {
                    if (_this.pending !== route) ;
                    _this.pending = null;
                    onComplete(route);
                    // if (this.router.app) {
                    //   this.router.app.$nextTick(() => {
                    //     postEnterCbs.forEach(cb => {
                    //       cb()
                    //     })
                    //   })
                    // }
                });
            });
        };
        History.prototype.updateRoute = function (route) {
            this.current = route;
            this.cb && this.cb(route);
        };
        History.prototype.teardown = function () {
            // clean up event listeners
            // https://github.com/vuejs/vue-router/issues/2341
            this.listeners.forEach(function (cleanupListener) {
                cleanupListener();
            });
            this.listeners = [];
            // reset current history route
            // https://github.com/vuejs/vue-router/issues/3294
            this.current = START;
            this.pending = null;
        };
        return History;
    }());
    /*   helper   */
    function normalizeBase(base) {
        if (!base) {
            if (inBrowser) {
                // respect <base> tag
                var baseEl = document.querySelector('base');
                base = (baseEl && baseEl.getAttribute('href')) || '/';
                // strip full URL origin
                base = base.replace(/^https?:\/\/[^\/]+/, '');
            }
            else {
                base = '/';
            }
        }
        // make sure there's the starting slash
        if (base.charAt(0) !== '/') {
            base = '/' + base;
        }
        // remove trailing slash
        return base.replace(/\/$/, '');
    }
    function resolveQueue(current, next) {
        var i;
        var max = Math.max(current.length, next.length);
        for (i = 0; i < max; i++) {
            if (current[i] !== next[i]) {
                break;
            }
        }
        return {
            updated: next.slice(0, i),
            activated: next.slice(i),
            deactivated: current.slice(i)
        };
    }

    /**
     * Tokenize input string.
     */
    function lexer(str) {
        var tokens = [];
        var i = 0;
        while (i < str.length) {
            var char = str[i];
            if (char === "*" || char === "+" || char === "?") {
                tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
                continue;
            }
            if (char === "\\") {
                tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
                continue;
            }
            if (char === "{") {
                tokens.push({ type: "OPEN", index: i, value: str[i++] });
                continue;
            }
            if (char === "}") {
                tokens.push({ type: "CLOSE", index: i, value: str[i++] });
                continue;
            }
            if (char === ":") {
                var name = "";
                var j = i + 1;
                while (j < str.length) {
                    var code = str.charCodeAt(j);
                    if (
                    // `0-9`
                    (code >= 48 && code <= 57) ||
                        // `A-Z`
                        (code >= 65 && code <= 90) ||
                        // `a-z`
                        (code >= 97 && code <= 122) ||
                        // `_`
                        code === 95) {
                        name += str[j++];
                        continue;
                    }
                    break;
                }
                if (!name)
                    throw new TypeError("Missing parameter name at " + i);
                tokens.push({ type: "NAME", index: i, value: name });
                i = j;
                continue;
            }
            if (char === "(") {
                var count = 1;
                var pattern = "";
                var j = i + 1;
                if (str[j] === "?") {
                    throw new TypeError("Pattern cannot start with \"?\" at " + j);
                }
                while (j < str.length) {
                    if (str[j] === "\\") {
                        pattern += str[j++] + str[j++];
                        continue;
                    }
                    if (str[j] === ")") {
                        count--;
                        if (count === 0) {
                            j++;
                            break;
                        }
                    }
                    else if (str[j] === "(") {
                        count++;
                        if (str[j + 1] !== "?") {
                            throw new TypeError("Capturing groups are not allowed at " + j);
                        }
                    }
                    pattern += str[j++];
                }
                if (count)
                    throw new TypeError("Unbalanced pattern at " + i);
                if (!pattern)
                    throw new TypeError("Missing pattern at " + i);
                tokens.push({ type: "PATTERN", index: i, value: pattern });
                i = j;
                continue;
            }
            tokens.push({ type: "CHAR", index: i, value: str[i++] });
        }
        tokens.push({ type: "END", index: i, value: "" });
        return tokens;
    }
    /**
     * Parse a string for the raw tokens.
     */
    function parse(str, options) {
        if (options === void 0) { options = {}; }
        var tokens = lexer(str);
        var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
        var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
        var result = [];
        var key = 0;
        var i = 0;
        var path = "";
        var tryConsume = function (type) {
            if (i < tokens.length && tokens[i].type === type)
                return tokens[i++].value;
        };
        var mustConsume = function (type) {
            var value = tryConsume(type);
            if (value !== undefined)
                return value;
            var _a = tokens[i], nextType = _a.type, index = _a.index;
            throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
        };
        var consumeText = function () {
            var result = "";
            var value;
            // tslint:disable-next-line
            while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
                result += value;
            }
            return result;
        };
        while (i < tokens.length) {
            var char = tryConsume("CHAR");
            var name = tryConsume("NAME");
            var pattern = tryConsume("PATTERN");
            if (name || pattern) {
                var prefix = char || "";
                if (prefixes.indexOf(prefix) === -1) {
                    path += prefix;
                    prefix = "";
                }
                if (path) {
                    result.push(path);
                    path = "";
                }
                result.push({
                    name: name || key++,
                    prefix: prefix,
                    suffix: "",
                    pattern: pattern || defaultPattern,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            var value = char || tryConsume("ESCAPED_CHAR");
            if (value) {
                path += value;
                continue;
            }
            if (path) {
                result.push(path);
                path = "";
            }
            var open = tryConsume("OPEN");
            if (open) {
                var prefix = consumeText();
                var name_1 = tryConsume("NAME") || "";
                var pattern_1 = tryConsume("PATTERN") || "";
                var suffix = consumeText();
                mustConsume("CLOSE");
                result.push({
                    name: name_1 || (pattern_1 ? key++ : ""),
                    pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                    prefix: prefix,
                    suffix: suffix,
                    modifier: tryConsume("MODIFIER") || ""
                });
                continue;
            }
            mustConsume("END");
        }
        return result;
    }
    /**
     * Compile a string to a template function for the path.
     */
    function compile(str, options) {
        return tokensToFunction(parse(str, options), options);
    }
    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction(tokens, options) {
        if (options === void 0) { options = {}; }
        var reFlags = flags(options);
        var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
        // Compile all the tokens into regexps.
        var matches = tokens.map(function (token) {
            if (typeof token === "object") {
                return new RegExp("^(?:" + token.pattern + ")$", reFlags);
            }
        });
        return function (data) {
            var path = "";
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (typeof token === "string") {
                    path += token;
                    continue;
                }
                var value = data ? data[token.name] : undefined;
                var optional = token.modifier === "?" || token.modifier === "*";
                var repeat = token.modifier === "*" || token.modifier === "+";
                if (Array.isArray(value)) {
                    if (!repeat) {
                        throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
                    }
                    if (value.length === 0) {
                        if (optional)
                            continue;
                        throw new TypeError("Expected \"" + token.name + "\" to not be empty");
                    }
                    for (var j = 0; j < value.length; j++) {
                        var segment = encode(value[j], token);
                        if (validate && !matches[i].test(segment)) {
                            throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                        }
                        path += token.prefix + segment + token.suffix;
                    }
                    continue;
                }
                if (typeof value === "string" || typeof value === "number") {
                    var segment = encode(String(value), token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
                    }
                    path += token.prefix + segment + token.suffix;
                    continue;
                }
                if (optional)
                    continue;
                var typeOfMessage = repeat ? "an array" : "a string";
                throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
            }
            return path;
        };
    }
    /**
     * Escape a regular expression string.
     */
    function escapeString(str) {
        return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
    }
    /**
     * Get the flags for a regexp from the options.
     */
    function flags(options) {
        return options && options.sensitive ? "" : "i";
    }
    /**
     * Pull out keys from a regexp.
     */
    function regexpToRegexp(path, keys) {
        if (!keys)
            return path;
        var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
        var index = 0;
        var execResult = groupsRegex.exec(path.source);
        while (execResult) {
            keys.push({
                // Use parenthesized substring match if available, index otherwise
                name: execResult[1] || index++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: ""
            });
            execResult = groupsRegex.exec(path.source);
        }
        return path;
    }
    /**
     * Transform an array into a regexp.
     */
    function arrayToRegexp(paths, keys, options) {
        var parts = paths.map(function (path) { return pathToRegexp(path, keys, options).source; });
        return new RegExp("(?:" + parts.join("|") + ")", flags(options));
    }
    /**
     * Create a path regexp from string input.
     */
    function stringToRegexp(path, keys, options) {
        return tokensToRegexp(parse(path, options), keys, options);
    }
    /**
     * Expose a function for taking tokens and returning a RegExp.
     */
    function tokensToRegexp(tokens, keys, options) {
        if (options === void 0) { options = {}; }
        var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function (x) { return x; } : _d;
        var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
        var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
        var route = start ? "^" : "";
        // Iterate over the tokens and create our regexp string.
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            if (typeof token === "string") {
                route += escapeString(encode(token));
            }
            else {
                var prefix = escapeString(encode(token.prefix));
                var suffix = escapeString(encode(token.suffix));
                if (token.pattern) {
                    if (keys)
                        keys.push(token);
                    if (prefix || suffix) {
                        if (token.modifier === "+" || token.modifier === "*") {
                            var mod = token.modifier === "*" ? "?" : "";
                            route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
                        }
                        else {
                            route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
                        }
                    }
                    else {
                        route += "(" + token.pattern + ")" + token.modifier;
                    }
                }
                else {
                    route += "(?:" + prefix + suffix + ")" + token.modifier;
                }
            }
        }
        if (end) {
            if (!strict)
                route += delimiter + "?";
            route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
        }
        else {
            var endToken = tokens[tokens.length - 1];
            var isEndDelimited = typeof endToken === "string"
                ? delimiter.indexOf(endToken[endToken.length - 1]) > -1
                : // tslint:disable-next-line
                    endToken === undefined;
            if (!strict) {
                route += "(?:" + delimiter + "(?=" + endsWith + "))?";
            }
            if (!isEndDelimited) {
                route += "(?=" + delimiter + "|" + endsWith + ")";
            }
        }
        return new RegExp(route, flags(options));
    }
    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     */
    function pathToRegexp(path, keys, options) {
        if (path instanceof RegExp)
            return regexpToRegexp(path, keys);
        if (Array.isArray(path))
            return arrayToRegexp(path, keys, options);
        return stringToRegexp(path, keys, options);
    }

    var regexpCompileCache = Object.create(null);
    function fillParams(path, params, routeMsg) {
        params = params || {};
        try {
            var filler = regexpCompileCache[path] ||
                (regexpCompileCache[path] = compile(path));
            // Fix #2505 resolving asterisk routes { name: 'not-found', params: { pathMatch: '/not-found' }}
            // and fix #3106 so that you can work with location descriptor object having params.pathMatch equal to empty string
            if (typeof params.pathMatch === 'string')
                params[0] = params.pathMatch;
            return filler(params, { pretty: true });
        }
        catch (e) {
            {
                if (typeof params.pathMatch !== 'string') {
                    warn("missing param for " + routeMsg + ": " + e.message);
                }
            }
            return '';
        }
        finally {
            // delete the 0 if it was added
            delete params[0];
        }
    }

    function cleanPath(path) {
        return path.replace(/\/\//g, '/');
    }
    function resolvePath(relative, base, append) {
        var firstChar = relative.charAt(0);
        if (firstChar === '/') {
            return relative;
        }
        if (firstChar === '?' || firstChar === '#') {
            return base + relative;
        }
        var stack = base.split('/');
        // remove trailing segment if:
        // - not appending
        // - appending to trailing slash (last segment is empty)
        if (!append || !stack[stack.length - 1]) {
            stack.pop();
        }
        // resolve relative path
        var segments = relative.replace(/^\//, '').split('/');
        for (var i = 0; i < segments.length; i++) {
            var segment = segments[i];
            if (segment === '..') {
                stack.pop();
            }
            else if (segment !== '.') {
                stack.push(segment);
            }
        }
        // ensure leading slash
        if (stack[0] !== '') {
            stack.unshift('');
        }
        return stack.join('/');
    }
    function parsePath(path) {
        var hash = '';
        var query = '';
        var hashIndex = path.indexOf('#');
        if (hashIndex >= 0) {
            hash = path.slice(hashIndex);
            path = path.slice(0, hashIndex);
        }
        var queryIndex = path.indexOf('?');
        if (queryIndex >= 0) {
            query = path.slice(queryIndex + 1);
            path = path.slice(0, queryIndex);
        }
        return {
            path: path,
            query: query,
            hash: hash
        };
    }

    function normalizeLocation(raw, current, append, router) {
        var next = typeof raw === 'string' ? { path: raw } : raw;
        if (next._normalized) {
            return next;
        }
        else if (next.name) {
            next = extend({}, raw);
            var params = next.params;
            if (params && typeof params === 'object') {
                next.params = extend({}, params);
            }
            return next;
        }
        // relative params
        if (!next.path && next.params && current) {
            next = extend({}, next);
            next._normalized = true;
            var params = extend(extend({}, current.params), next.params);
            if (current.name) {
                next.name = current.name;
                next.params = params;
            }
            else if (current.matched.length) {
                var rawPath = current.matched[current.matched.length - 1].path;
                next.path = fillParams(rawPath, params, "path " + current.path);
            }
            else {
                warn("relative params navigation requires a current route.");
            }
            return next;
        }
        var parsedPath = parsePath(next.path || '');
        var basePath = (current && current.path) || '/';
        var path = parsedPath.path
            ? resolvePath(parsedPath.path, basePath, append || next.append)
            : basePath;
        var query = resolveQuery(parsedPath.query, next.query, router && router.options.parseQuery);
        var hash = next.hash || parsedPath.hash;
        if (hash && hash.charAt(0) !== '#') {
            hash = "#" + hash;
        }
        return {
            _normalized: true,
            path: path,
            query: query,
            hash: hash
        };
    }
    function getLocation(base) {
        var path = window.location.pathname;
        if (base && path.toLowerCase().indexOf(base.toLowerCase()) === 0) {
            path = path.slice(base.length);
        }
        return (path || '/') + window.location.search + window.location.hash;
    }

    var Time = inBrowser && window.performance && window.performance.now
        ? window.performance
        : Date;
    function genStateKey() {
        return Time.now().toFixed(3);
    }
    var _key = genStateKey();
    function getStateKey() {
        return _key;
    }
    function setStateKey(key) {
        return (_key = key);
    }

    function pushState(url, replace) {
        var history = window.history;
        try {
            if (replace) {
                // preserve existing history state as it could be overriden by the user
                var stateCopy = extend({}, history.state);
                stateCopy.key = getStateKey();
                history.replaceState(stateCopy, '', url);
            }
            else {
                history.pushState({ key: setStateKey(genStateKey()) }, '', url);
            }
        }
        catch (e) {
            window.location[replace ? 'replace' : 'assign'](url);
        }
    }
    function replaceState(url) {
        pushState(url, true);
    }

    var HashHistory = /** @class */ (function (_super) {
        __extends(HashHistory, _super);
        function HashHistory(router, base, fallback) {
            var _this = _super.call(this, router, base) || this;
            if (fallback && checkFallback(_this.base)) {
                return _this;
            }
            ensureSlash();
            return _this;
        }
        HashHistory.prototype.setupListeners = function () {
            var _this = this;
            if (this.listeners.length > 0) {
                return;
            }
            var router = this.router;
            var handleRoutingEvent = function () {
                var current = _this.current;
                if (!ensureSlash()) {
                    return;
                }
                _this.transitionTo(getHash(), function (route) { });
            };
            window.addEventListener('popstate', handleRoutingEvent);
        };
        HashHistory.prototype.go = function (n) {
            window.history.go(n);
        };
        HashHistory.prototype.push = function (location, onComplete, onAbort) {
            var fromRoute = this.current;
            this.transitionTo(location, function (route) {
                pushHash(route.fullPath);
                onComplete && onComplete(route);
            }, onAbort);
        };
        HashHistory.prototype.ensureURL = function (push) {
            var current = this.current.fullPath;
            if (getHash() !== current) {
                push ? pushHash(current) : replaceHash(current);
            }
        };
        HashHistory.prototype.getCurrentLocation = function () {
            return getHash();
        };
        return HashHistory;
    }(History));
    function ensureSlash() {
        var path = getHash();
        if (path.charAt(0) === '/') {
            return true;
        }
        replaceHash('/' + path);
        return false;
    }
    function checkFallback(base) {
        var location = getLocation(base);
        if (!/^\/#/.test(location)) {
            window.location.replace(cleanPath(base + '/#' + location));
            return true;
        }
    }
    function getHash() {
        var href = window.location.href;
        var index = href.indexOf('#');
        if (index < 0)
            return '';
        href = href.slice(index + 1);
        return href;
    }
    function getUrl(path) {
        var href = window.location.href;
        var i = href.indexOf('#');
        var base = i >= 0 ? href.slice(0, i) : href;
        return base + "#" + path;
    }
    function replaceHash(path) {
        replaceState(getUrl(path));
    }
    function pushHash(path) {
        pushState(getUrl(path));
    }

    function createRouteMap(routes, oldPathList, oldPathMap, oldNameMap) {
        if (oldPathList === void 0) { oldPathList = []; }
        if (oldPathMap === void 0) { oldPathMap = Object.create(null); }
        if (oldNameMap === void 0) { oldNameMap = Object.create(null); }
        var pathList = oldPathList;
        var pathMap = oldPathMap;
        var nameMap = oldNameMap;
        routes.forEach(function (route) {
            addRouteRecord(pathList, pathMap, nameMap, route);
        });
        // 确保通配符路由总是在最后
        var index = pathList.indexOf('*');
        if (index > -1) {
            pathList.push(pathList.splice(index, 1)[0]);
        }
        return {
            pathList: pathList,
            pathMap: pathMap,
            nameMap: nameMap
        };
    }
    function addRouteRecord(pathList, pathMap, nameMap, route, parent, matchAs) {
        var path = route.path, name = route.name, component = route.component, components = route.components, redirect = route.redirect, _a = route.meta, meta = _a === void 0 ? {} : _a, props = route.props;
        var normalizedPath = normalizePath(path, parent, false);
        var routeRecord = {
            path: normalizedPath,
            regex: compileRouteRegex(normalizedPath),
            components: components || { default: component },
            instances: {},
            name: name,
            parent: parent,
            matchAs: matchAs,
            redirect: redirect,
            meta: meta,
            props: props == null
                ? {}
                : components
                    ? props
                    : { default: props }
        };
        if (route.children) ;
        if (!pathMap[path]) {
            pathList.push(path);
            pathMap[path] = routeRecord;
        }
        if (name) {
            if (!nameMap[name]) {
                nameMap[name] = routeRecord;
            }
        }
    }
    function normalizePath(path, parent, strict) {
        if (!strict)
            path = path.replace(/\/$/, '');
        if (path[0] === '/')
            return path;
        if (parent == null)
            return path;
        return cleanPath(parent.path + "/" + path);
    }
    function compileRouteRegex(path) {
        var regex = pathToRegexp(path, []);
        return regex;
    }

    function createMatcher(routes, router) {
        var _a = createRouteMap(routes), pathList = _a.pathList, pathMap = _a.pathMap, nameMap = _a.nameMap;
        var match = function (raw, currentRoute, redirectedFrom) {
            var location = normalizeLocation(raw, currentRoute, false, router);
            var name = location.name;
            if (name) {
                var record = nameMap[name];
                if (!record) {
                    return _createRoute(null, location);
                }
                var paramNames = record.regex.keys
                    .filter(function (key) { return !key.optional; })
                    .map(function (key) { return key.name; });
                if (typeof location.params !== 'object') {
                    location.params = {};
                }
                if (currentRoute && typeof currentRoute.params === 'object') {
                    for (var key in currentRoute.params) {
                        if (!(key in location.params) && paramNames.indexOf(key) > -1) {
                            location.params[key] = currentRoute.params[key];
                        }
                    }
                }
                location.path = fillParams(record.path, location.params, "named route \"" + name + "\"");
                return _createRoute(record, location, redirectedFrom);
            }
            else if (location.path) {
                location.params = {};
                for (var i = 0; i < pathList.length; i++) {
                    var path = pathList[i];
                    var record = pathMap[path];
                    if (matchRoute(record.regex, location.path, location.params)) {
                        return _createRoute(record, location, redirectedFrom);
                    }
                }
            }
            return _createRoute(null, location);
        };
        function _createRoute(record, location, redirectedFrom) {
            if (record && record.redirect) ;
            if (record && record.matchAs) ;
            return createRoute(record, location, redirectedFrom, router);
        }
        return {
            match: match
        };
    }
    function matchRoute(regex, path, params) {
        var m = decodeURI(path).match(regex);
        if (!m) {
            return false;
        }
        else if (!params) {
            return true;
        }
        for (var i = 1, len = m.length; i < len; ++i) {
            var key = regex.keys[i - 1];
            if (key) {
                // Fix #1994: using * with props: true generates a param named 0
                params[key.name || 'pathMatch'] = m[i];
            }
        }
        return true;
    }

    var VueRouter = /** @class */ (function () {
        function VueRouter(options) {
            if (options === void 0) { options = {}; }
            this.app = null;
            this.apps = [];
            this.options = options;
            this.matcher = createMatcher(options.routes || [], this);
            this.history = new HashHistory(this, options.base);
        }
        VueRouter.prototype.match = function (raw, current, redirectedFrom) {
            return this.matcher.match(raw, current, redirectedFrom);
        };
        return VueRouter;
    }());

    var routes = [
        {
            path: '/',
            name: 'home',
            component: {},
            alias: '/home'
        },
        {
            path: '/login',
            name: 'login',
            component: {},
            alias: '/login'
        },
    ];
    var router = new VueRouter({
        routes: routes,
        base: '/'
    });
    console.log(router);
    router.history.push('/login');

}());
