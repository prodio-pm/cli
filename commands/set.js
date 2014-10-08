var support = require('../lib/apisupport');
//var fs = require('fs');

var set = function(key, value){
  var project = support.getProject();
  project[key] = value;
  support.storeProject(project);
};

set.name = 'set';
set.description = 'Set a project value locally';

module.exports = set;
