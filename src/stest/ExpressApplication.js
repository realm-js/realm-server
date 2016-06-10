"use realm backend";

import Express from realm.server;

class ExpressApplication extends Express {

   configure() {
      this.serve("/dependencies/", "@default");
      this.serve("/static/", "@home/static");

      this.addScripts([
         '/dependencies/lodash.min.js',
         '/dependencies/realm.js',
         '/dependencies/realm.router.js'
      ]);
      var i = 0;
      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Hello',
         title: "Hello",
         onRender: function(req, res) {
            return new Promise(function(resolve, reject) {
               return resolve({
                  base: "/sukka",
                  window: {
                     hello: "'pukka sukka'",
                     pukka: i++
                  }
               })
            })
         }
      });

      this.start();
   }
}
export ExpressApplication
