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
