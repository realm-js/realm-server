(function(___scope___) {
    "use strict";
    var $isBackend = ___scope___.isNode;
    var realm = ___scope___.realm;
    realm.module("stest.ExpressApplication", ["realm.server.Express"], function(Express) {
        var $_exports;
        class ExpressApplication extends Express {
            configure() {
                this.serve("/dependencies/", "@default");
                this.serve("/static/", "@home/static");
                this.addScripts([
                    '/dependencies/lodash.min.js',
                    '/dependencies/realm.js',
                    '/dependencies/realm.router.js'
                ]);
                this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
                    application: 'app.Hello',
                    title: "Hello"
                });
                this.start();
            }
        }
        $_exports = ExpressApplication
        return $_exports;
    });
    realm.module("realm.server.Express", ["realm.server.utils.lodash", "realm.server.utils.path", "realm.server.utils.swig", "realm.server.utils.express", "realm.server.utils.bodyParser", "realm.server.utils.cookieParser", "realm.server.utils.rootPath", "realm.router.Express"], function(_, path, swig, express, bodyParser, cookieParser, rootPath, RealmRouterExpress) {
        var $_exports;
        class Express {
            constructor() {
                this.port = 3030;
                this.url = "/"
                this.app = express();
                this.defaultConfiguration();
                this.configure();
            }
            defaultConfiguration() {
                this.routePackages = ["realm.router.bridge"];
                this.isDev = true;
                this.scripts = [];
                this.styles = [];
                this.macros = {};
                this.defaultMacros();
                this.app.use(cookieParser('your secret here'));
                this.app.use(bodyParser.json());
                this.app.use(bodyParser.urlencoded({
                    extended: true
                }));
            }
            defaultMacros() {
                this.addMacro('default', __dirname + "/../frontend");
                this.addMacro('home', rootPath);
            }
            filterMacro(str) {
                _.each(this.macros, function(value, key) {
                    str = str.split('@' + key).join(value);
                });
                return str;
            }
            addMacro(name, path) {
                this.macros[name] = path;
            }
            addScripts() {
                var self = this;
                var scripts = _.flatten(arguments);
                _.each(scripts, function(script) {
                    self.scripts.push(script);
                });
            }
            addStyles() {
                var self = this;
                var styles = _.flatten(arguments);
                _.each(styles, function(style) {
                    self.styles.push(style);
                });
            }
            serve(path, folder) {
                folder = this.filterMacro(folder);
                this.app.use(path, express.static(folder));
            }
            addRoute() {
                var self = this;
                var routes = _.flatten(arguments);
                _.each(routes, function(route) {
                    self.routePackages.push(route);
                });
            }
            /**
             * Digest packages
             */
            digest() {
                var list = _.flatten(arguments);
                _.each(list, function(item) {
                    require(item);
                });
            }
            bindIndex(regexp, template, opts) {
                var self = this;
                var templatePath = _.isString(template) ? template : path.join(__dirname + "/../../index.html");
                templatePath = this.filterMacro(templatePath);
                var tempateData = {};
                if (_.isPlainObject(template)) {
                    tempateData = template;
                }
                if (_.isPlainObject(opts)) {
                    tempateData = opts;
                }
                if (!tempateData.scripts) {
                    tempateData.scripts = this.scripts;
                }
                if (!tempateData.styles) {
                    tempateData.styles = this.styles;
                }
                var startingUrl = this.url.split("")
                this.app.use(regexp, function(req, res) {
                    res.send(swig.renderFile(templatePath, tempateData));
                });
            }
            /**
             * start - description
             *
             * @return {type}  description
             */
            start(template, opts) {
                // Digesting routes
                this.app.use(RealmRouterExpress(this.routePackages, {
                    prettyTrace: this.isDev
                }))
                var self = this;
                var server = this.app.listen(this.port, function() {
                    var host = server.address().address;
                    console.log('RealmWebApp listening at http://%s:%s', host, self.port);
                });
            }
            static main() {
                var app = new this();
            }
        }
        $_exports = Express;
        return $_exports;
    });
    "use realm backend-raw";
    // Digest router
    var router = require('realm-router');
    realm.module("realm.server.utils.lodash", function() {
        return require('lodash');
    });
    realm.module('realm.server.utils.swig', function() {
        return require('swig');
    });
    realm.module('realm.server.utils.bodyParser', function() {
        return require('body-parser');
    });
    realm.module('realm.server.utils.express', function() {
        return require('express');
    });
    realm.module('realm.server.utils.cookieParser', function() {
        return require('cookie-parser');
    });
    realm.module('realm.server.utils.path', function() {
        return require('path');
    });
    realm.module('realm.server.utils.rootPath', function() {
        return require('app-root-path');
    });
})(function(self) {
    var isNode = typeof exports !== 'undefined';
    return {
        isNode: isNode,
        realm: isNode ? require('realm-js') : window.realm
    }
}());