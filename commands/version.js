var semver = require('semver');
var fs = require('fs');
var readline = require('readline');

var commitVersion = function(version){
  var values = JSON.parse(fs.readFileSync('./.prodio'));
  values.version = version;
  fs.writeFileSync('./.prodio', JSON.stringify(values, null, '  '));
};

var ver = function(){
  var v = arguments[0];
  fs.exists('./.prodio', function(exists){
    if(!exists){
      console.error('Prdio project does not exist, init it with prodio init');
      process.exit(1);
    }
    if(!v){
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      var version = JSON.parse(fs.readFileSync('./.prodio')).version;
      return rl.question('New version ('+version+'):', function(answer){
        rl.close();
        if(!answer){
          return;
        }
        if(!semver.valid(answer)){
          console.error('Invalid Semantic Version specified');
          return process.exit(1);
        }
        return commitVersion(answer);
      })
    }
    if(semver.valid(v)){
      return commitVersion(v);
    }
    console.error('Invalid Semantic Version specified');
    return process.exit(1);
  });
};

ver.command = 'ver';
ver.description = 'Update the version of the project or node';

module.exports = ver;
