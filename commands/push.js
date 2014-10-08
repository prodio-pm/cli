var support = require('../lib/apisupport');
var request = require('request');
var async = require('async');

var push = function(key, value){
  var project= support.getProject();
  var children = project.children||[];
  var values=(function(){
    var keys = Object.keys(project);
    var result = {};
    keys.forEach(function(key){
      if(key !== 'children'){
        result[key] = project[key];
      }
    });
    return result;
  })();
  var id = values._id;
  if(id){
    delete values.id;
    console.log('Updating project');
    return request({
      method: 'POST',
      body: JSON.stringify(values),
      uri: values.host+'/api/v1/project/'+id
    }, function(err, request, body){
      var project = JSON.parse(body);
      project = project[project.root]||project;
      async.eachLimit(children, 10, function(child, next){
        var child_id = child._id;
        delete child._id;
        request({
          method: 'POST',
          body: JSON.stringify(child),
          uri: values.host+'/api/v1/project/'+id+'/item/'+child_id
        }, function(err, request, body){
          if(err){
            console.error(err.error||err.stack||err);
            return process.exit(1);
          }
          next();
        });
      }, function(){
        require('./pull')();
      });
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
    async.eachLimit(children, 10, function(child, next){
      var child_id = child._id;
      delete child._id;
      request({
        method: 'POST',
        body: JSON.stringify(child),
        uri: values.host+'/api/v1/project/'+project._id+'/item/'+child_id
      }, function(err, request, body){
        if(err){
          console.error(err.error||err.stack||err);
          return process.exit(1);
        }
        next();
      });
    }, function(){
      console.log('Created as '+project._id);
      console.log('Updating from server');
      require('./pull')();
    })
  });
};

push.name = 'push';
push.description = 'Push local changes to the project server';

module.exports = push;
