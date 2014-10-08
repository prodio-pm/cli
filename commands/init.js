var fs = require('fs');
var path = require('path');
var readline = require('readline');
var semver = require('semver');
var request = require('request');
var support = require('apisupport');

var questions = [
  {
    key: 'host',
    question: 'Prodio Host:',
    default: 'http://localhost:8080'
  },
  {
    key: 'projectName',
    question: 'Project Name',
    postAction: function(rl, values, next){
      request(values.host+'/api/v1/projects?q='+values.projectName, function(err, response, body){
        if(err){
          console.error(err.error||err.stack||err);
          return next;
        }
        var options = JSON.parse(body);
        options = options[options.root]||[];
        if(options.length){
          options.forEach(function(option, id){
            console.log((id+1)+') '+option.name+' v'+option.version);
            if(option.description){
              console.log('  '+option.description);
            }
          });
          return rl.question('Select a project above or <enter> for a new one:', function(answer){
            answer = parseInt(answer)||'';
            if(answer>0){
              answer--;
              return request(values.host+'/api/v1/project/'+options[answer]._id, function(err, request, body){
                var project = JSON.parse(body);
                project = project[project.root];
                values._id = project._id;
                values.name = project.name;
                values.version = values.version||project.version;
                values.description = values.description||project.description;
                return next();
              });
            }
            return next();
          });
        }
        return next();
      });
    }
  },
  {
    key: 'version',
    question: 'Version',
    validate: function(value){
      return semver.valid(value);
    }
  },
  {
    key: 'description',
    question: 'Description'
  },
];

var done = function(rl, values){
  support.writeProject(values);
  if(!values._id){
    return rl.question('No project ID found, create project now (yes/no)?', function(answer){
      rl.close();
      var answer = !!answer.match(/(yes|y|1|true)/i);
      if(answer){
        return request({
          method: 'POST',
          body: JSON.stringify(values),
          uri: values.host+'/api/v1/project'
        }, function(err, request, body){
          if(err){
            console.error(err.error||err.stack||err);
            return process.exit(1);
          }
          var project = JSON.parse(body);
          id = project[project.root]._id;
          console.log('Created project ID '+id);
        });
      }
      console.log('Project not created, you can run prodio init at any time to create it.');
    });
  }
  return rl.question('Sync changes to project server (yes/no)?', function(answer){
    var answer = !!answer.match(/(yes|y|1|true)/i);
    rl.close();
    if(answer){
      var id = values._id;
      delete values._id;
      return request({
        method: 'POST',
        body: JSON.stringify(values),
        uri: values.host+'/api/v1/project/'+id
      }, function(err, request, body){
        if(err){
          console.error(err.error||err.stack||err);
          return process.exit(1);
        }
        require('./pull')();
      });
    }
  });
};

var init = function(projectName, version){
  var args = arguments;
  if(!projectName){
    projectName = path.resolve('./').split('/').pop();
  }
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  var nextQuestion = function(values){
    var question = questions.shift();
    if(!question){
      return done(rl, values);
    }
    var key = question.key;
    var value = values[key]||question.default||'';
    rl.question(question.question+' ('+value+'):', function(answer){
      values[key] = answer || value;
      if(question.postAction){
        return question.postAction(rl, values, function(){
          return process.nextTick(function(){
            nextQuestion(values);
          });
        });
      }
      return process.nextTick(function(){
        nextQuestion(values);
      });
    });
  };
  fs.exists('./.prodio', function(exists){
    var hasVersion = !!semver.valid(version);
    var description = Array.prototype.slice.call(args, hasVersion?2:1).join(' ').trim();
    var values = exists?support.getRoot():{
      projectName: projectName,
      version: hasVersion?version:'0.0.1',
    };
    values.projectName = projectName || values.projectName;
    values.version = hasVersion?version:values.version;
    values.description = description||values.description||'';
    nextQuestion(values);
  });
};

init.command = 'init';
init.description = 'Initialize a new Prodio project.';

module.exports = init;
