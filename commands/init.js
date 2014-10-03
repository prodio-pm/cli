var fs = require('fs');
var path = require('path');
var readline = require('readline');
var semver = require('semver');

var questions = [
  {
    key: 'projectName',
    question: 'Project Name'
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

var done = function(values){
  fs.writeFileSync('./.prodio', JSON.stringify(values, null, '  '));
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
      rl.close();
      return done(values);
    }
    var key = question.key;
    var value = values[key]||question.default||'';
    rl.question(question.question+' ('+value+'):', function(answer){
      values[key] = answer || value;
      return process.nextTick(function(){
        nextQuestion(values);
      });
    });
  };
  fs.exists('./.prodio', function(exists){
    var hasVersion = !!semver.valid(version);
    var description = Array.prototype.slice.call(args, hasVersion?2:1).join(' ').trim();
    var values = exists?JSON.parse(fs.readFileSync('./.prodio')):{
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
