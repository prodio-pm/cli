var request = require('request');
var fs = require('fs');

var pull = function(key, value){
  var values = JSON.parse(fs.readFileSync('./.prodio'));
  var id = values._id;
  if(id){
    delete values.id;
    return request({
      method: 'GET',
      uri: values.host+'/api/v1/project/'+id
    }, function(err, request, body){
      var project = JSON.parse(body);
      project = project[project.root]||project;
      fs.writeFileSync('./.prodio', JSON.stringify(project, null, '  '));
      console.log('Updated');
    });
  }
  console.log('No Project ID exists.  You must push or init the project first!');
  process.exit(1);
};

pull.name = 'pull';
pull.description = 'pull local changes from the project server to local';

module.exports = pull;
