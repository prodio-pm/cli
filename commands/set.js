var fs = require('fs');

var set = function(key, value){
  var values = JSON.parse(fs.readFileSync('./.prodio'));
  values[key] = value;
  fs.writeFileSync('./.prodio', JSON.stringify(values, null, '  '));
};

set.name = 'set';
set.description = 'Set a project value locally';

module.exports = set;
