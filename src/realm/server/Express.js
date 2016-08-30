"use realm backend";
import lodash as _, path, swig, express from realm.server.utils;
import bodyParser, cookieParser, rootPath from realm.server.utils;
import Express as RealmRouterExpress from realm.router;

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

      this.app.use(bodyParser.json({
         limit:1024*1024*80,
         parameterLimit:50000
      }));
      this.app.use(bodyParser.urlencoded({
          extended: true,
          limit:1024*1024*80,
          parameterLimit:50000
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

         if (tempateData && _.isFunction(tempateData.onRender)) {
            var result = tempateData.onRender(req, res);
            if (result && _.isFunction(result.then)) {
               result.then(function(data) {
                  var _t = tempateData;
                  if (_.isPlainObject(data)) {
                     _t = _.merge(_t, data);
                  }

                  res.send(swig.renderFile(templatePath, _t));
               });
            } else {
               res.send(swig.renderFile(templatePath, tempateData));
            }
         } else {
            res.send(swig.renderFile(templatePath, tempateData));
         }

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

export Express;
