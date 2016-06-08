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

      this.bindIndex(/^\/(?!api|_realm_|favicon.ico).*/, {
         application: 'app.Hello',
         title: "Hello"
      });
      
      this.start();
   }
}
export ExpressApplication
