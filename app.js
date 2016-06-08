var realm = require('realm-js');
var backend = require('./dist/backend/realm.server.js');

realm.start('stest.ExpressApplication').then(function() {
   console.log('all good')
}).catch(function(e) {
   console.log(e.stack || e)
})
