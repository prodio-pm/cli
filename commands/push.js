var request = require('request');
var fs = require('fs');

var push = function(key, value){
  var values = JSON.parse(fs.readFileSync('./.prodio'));
  var id = values._id;
  if(id){
    delete values.id;
    return request({
      method: 'POST',
      body: JSON.stringify(values),
      uri: values.host+'/api/v1/project/'+id
    }, function(err, request, body){
      var project = JSON.parse(body);
      project = project[project.root]||project;
      fs.writeFileSync('./.prodio', JSON.stringify(project, null, '  '));
      console.log('Updated');
    });
  }
  console.log('Creating project');
  return request({
    method: 'POST',
    body: JSON.stringify(values),
    uri: values.host+'/api/v1/project'
  }, function(err, request, body){
    var project = JSON.parse(body);
    project = project[project.root]||project;
    fs.writeFileSync('./.prodio', JSON.stringify(project, null, '  '));
    console.log('Created as '+project._id);
  });
};

push.name = 'push';
push.description = 'Push local changes to the project server';

module.exports = push;
